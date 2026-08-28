"use client";

import React, { useEffect, useState } from "react";

export function NoticeBanner({ currentUser }: { currentUser?: any }) {
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotice() {
      try {
        let user = currentUser;

        if (!user || (!user.username && !user.id && !user.name)) {
          const meRes = await fetch("/api/me");
          if (meRes.ok) {
            const meData = await meRes.json();
            user = meData.user || meData;
          }
        }

        const res = await fetch("/api/notice");
        if (!res.ok) return;

        const rawData = await res.json();
        const rawList: any[] = Array.isArray(rawData)
          ? rawData
          : rawData.history || rawData.notices || rawData.data || [];

        const list = [...rawList].reverse();

        const matchingNotice = list.find((item: any) => {
          // 1. Active Check
          const isActive =
            item.isActive === true ||
            item.isActive === 1 ||
            item.isActive === "true" ||
            item.is_active === true ||
            item.is_active === 1 ||
            String(item.status).toUpperCase() === "ACTIVE";

          if (!isActive) return false;

          // 2. Audience Decoding
          const rawAud = String(
            item.targetAudience || item.audienceType || item.audience || "all"
          ).toLowerCase();

          if (rawAud === "all") return true;

          const role = String(user?.role || "teacher").toLowerCase();
          if ((rawAud === "teachers" || rawAud === "teacher") && (role === "teacher" || role === "teachers")) return true;
          if ((rawAud === "admins" || rawAud === "admin") && (role === "admin" || role === "admins")) return true;

          // 3. Encoded Custom Match (custom:[...])
          if (rawAud.startsWith("custom:") || rawAud.startsWith("specific:")) {
            const jsonPart = rawAud.slice(rawAud.indexOf(":") + 1);
            let targets: string[] = [];

            try {
              targets = JSON.parse(jsonPart);
            } catch {
              targets = [jsonPart];
            }

            const userIdentifiers = [
              user?.id !== undefined ? String(user.id).toLowerCase().trim() : "",
              user?.username ? String(user.username).toLowerCase().trim() : "",
              user?.email ? String(user.email).toLowerCase().trim() : "",
              user?.email ? String(user.email.split("@")[0]).toLowerCase().trim() : "",
              user?.name ? String(user.name).toLowerCase().trim() : "",
            ].filter(Boolean);

            return targets.some((t: any) =>
              userIdentifiers.includes(String(t).toLowerCase().trim())
            );
          }

          return false;
        });

        if (matchingNotice) {
          setNoticeMessage(
            matchingNotice.message || matchingNotice.content || matchingNotice.notice
          );
        } else {
          setNoticeMessage(null);
        }
      } catch (err) {
        console.error("[NoticeBanner] Error:", err);
      }
    }

    loadNotice();
  }, [currentUser]);

  if (!noticeMessage) return null;

  return (
    <div className="bg-amber-50 border border-amber-300 text-stone-900 rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
        !
      </div>
      <div className="text-xs font-sans text-stone-800 leading-relaxed">
        <span className="font-bold text-stone-900 mr-1.5">Announcement:</span>
        {noticeMessage}
      </div>
    </div>
  );
}
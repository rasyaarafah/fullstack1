"use client";

import React, { useEffect, useState } from "react";

export function NoticeBanner({ currentUser }: { currentUser?: any }) {
  const [activeNotice, setActiveNotice] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(currentUser);

  useEffect(() => {
    async function loadNotice() {
      try {
        let user = currentUser;

        if (!user || (!user.username && !user.id && !user.name)) {
          const meRes = await fetch("/api/me");
          if (meRes.ok) {
            const meData = await meRes.json();
            user = meData.user || meData;
            setUserData(user);
          }
        } else {
          setUserData(user);
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

          // 2. Read / Acknowledged Check
          const userIdentifiers = [
            user?.id !== undefined ? String(user.id).toLowerCase().trim() : "",
            user?.username ? String(user.username).toLowerCase().trim() : "",
            user?.email ? String(user.email).toLowerCase().trim() : "",
            user?.email ? String(user.email.split("@")[0]).toLowerCase().trim() : "",
            user?.name ? String(user.name).toLowerCase().trim() : "",
          ].filter(Boolean);

          const readList: any[] = item.readStatus || item.read_status || item.reads || [];
          const hasAlreadyRead = readList.some((r: any) => {
            const readerName = String(r.username || r.user || r.userId || r).toLowerCase().trim();
            const isRead = r.hasRead !== false && r.read !== false;
            return userIdentifiers.includes(readerName) && isRead;
          });

          if (hasAlreadyRead) return false;

          // 3. Audience Decoding
          const rawAud = String(
            item.targetAudience || item.audienceType || item.audience || "all"
          ).toLowerCase();

          if (rawAud === "all") return true;

          const role = String(user?.role || "teacher").toLowerCase();
          if ((rawAud === "teachers" || rawAud === "teacher") && (role === "teacher" || role === "teachers")) return true;
          if ((rawAud === "admins" || rawAud === "admin") && (role === "admin" || role === "admins")) return true;

          // 4. Encoded Custom Match (custom:[...])
          if (rawAud.startsWith("custom:") || rawAud.startsWith("specific:")) {
            const jsonPart = rawAud.slice(rawAud.indexOf(":") + 1);
            let targets: string[] = [];

            try {
              targets = JSON.parse(jsonPart);
            } catch {
              targets = [jsonPart];
            }

            return targets.some((t: any) =>
              userIdentifiers.includes(String(t).toLowerCase().trim())
            );
          }

          return false;
        });

        setActiveNotice(matchingNotice || null);
      } catch (err) {
        console.error("[NoticeBanner] Error:", err);
      }
    }

    loadNotice();
  }, [currentUser]);

  const handleAcknowledge = async () => {
    if (!activeNotice) return;
    setLoading(true);

    const userIdentifier =
      userData?.username ||
      userData?.email ||
      userData?.name ||
      "Teacher";

    try {
      const res = await fetch("/api/notice/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noticeId: activeNotice.id || activeNotice._id,
          username: userIdentifier,
        }),
      });

      if (res.ok) {
        setActiveNotice(null);
      }
    } catch (err) {
      console.error("Failed to acknowledge notice:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!activeNotice) return null;

  const noticeMessage =
    activeNotice.message || activeNotice.content || activeNotice.notice;

  return (
    <div className="bg-amber-50 border border-amber-300 text-stone-900 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
          !
        </div>
        <div className="text-xs font-sans text-stone-800 leading-relaxed">
          <span className="font-bold text-stone-900 mr-1.5">
            Announcement:
          </span>
          {noticeMessage}
        </div>
      </div>

      <button
        onClick={handleAcknowledge}
        disabled={loading}
        className="px-4 py-1.5 bg-[#0A4D3C] hover:bg-[#07382c] text-white font-medium text-xs rounded-full transition-all cursor-pointer shrink-0 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Acknowledge"}
      </button>
    </div>
  );
}
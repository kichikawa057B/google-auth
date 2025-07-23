"use client";

import { useState, useEffect } from "react";

interface CalendarEvent {
  id: string;
  summary: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
}

interface WeeklyCalendarProps {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: string | null;
}

export default function WeeklyCalendar({ accessToken, refreshToken, expiresIn }: WeeklyCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/calendar?access_token=${accessToken}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch calendar events");
        }

        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchEvents();
    }
  }, [accessToken]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">カレンダー情報を読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        エラー: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">今週のカレンダー</h2>
        <a
          href={`/?access_token=${accessToken}${refreshToken ? `&refresh_token=${refreshToken}` : ''}${expiresIn ? `&expires_in=${expiresIn}` : ''}`}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          戻る
        </a>
      </div>
      
      {events.length === 0 ? (
        <p className="text-gray-600">今週の予定はありません。</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.summary || "無題"}
                  </h3>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    {event.start?.dateTime && (
                      <div className="flex items-center space-x-2">
                        <span>{formatDate(event.start.dateTime)}</span>
                        <span>
                          {formatTime(event.start.dateTime)} - {" "}
                          {event.end?.dateTime && formatTime(event.end.dateTime)}
                        </span>
                      </div>
                    )}
                    
                    {event.start?.date && (
                      <div className="flex items-center">
                        <span>終日: {formatDate(event.start.date)}</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="mt-2 text-sm text-gray-700">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
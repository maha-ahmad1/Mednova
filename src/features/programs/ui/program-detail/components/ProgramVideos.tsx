"use client"

import { useState } from "react"
import { PlayCircle, Clock } from "lucide-react"
import type { ProgramVideo } from "@/features/programs/types/program"

interface ProgramVideosProps {
  videos: ProgramVideo[]
}

export function ProgramVideos({ videos }: ProgramVideosProps) {
  const [selectedVideo, setSelectedVideo] = useState<ProgramVideo | null>(videos[0] || null)

  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">محتوى البرنامج</h2>

      {selectedVideo && (
        <div className="mb-6">
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
            <video key={selectedVideo.id} controls className="w-full h-full" poster={selectedVideo.video_path}>
              <source src={selectedVideo.video_path} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو
            </video>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h3>
          <p className="text-gray-600 leading-relaxed">{selectedVideo.description}</p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 mb-4">قائمة الفيديوهات ({videos.length})</h3>
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className={`w-full text-right p-4 rounded-xl border transition-all duration-300 ${
              selectedVideo?.id === video.id
                ? "border-[#32A88D] bg-[#32A88D]/5"
                : "border-gray-200 hover:border-[#32A88D]/50 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedVideo?.id === video.id ? "bg-[#32A88D]" : "bg-gray-100"
                }`}
              >
                <PlayCircle className={`w-6 h-6 ${selectedVideo?.id === video.id ? "text-white" : "text-gray-600"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900">
                    {index + 1}. {video.title}
                  </h4>
                  {video.duration_minute && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{video.duration_minute} دقيقة</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
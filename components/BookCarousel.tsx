"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, ArrowLeft, ArrowRight, Play, Pause, Bookmark, ExternalLink } from "lucide-react";

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  tag: string;
  image: string;
  pinUrl: string;
}

const FEATURED_BOOKS: BookItem[] = [
  {
    id: "pin-1",
    title: "Vẽ Bìa Truyện Cổ Tích",
    subtitle: "Thế giới huyền thoại & thần tiên",
    genre: "Fiction",
    tag: "Art & Fairy Tales",
    image: "/images/books/book-cover-1.jpg",
    pinUrl: "https://in.pinterest.com/pin/666955026089397981/",
  },
  {
    id: "pin-2",
    title: "Hồ Điệp & Kình Ngư",
    subtitle: "Tiểu thuyết lãng mạn phương Đông",
    genre: "Fiction",
    tag: "Romantic Fiction",
    image: "/images/books/book-cover-2.jpg",
    pinUrl: "https://in.pinterest.com/pin/900086675541451807/",
  },
  {
    id: "pin-3",
    title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya",
    subtitle: "Kiệt tác cảm động của Higashino Keigo",
    genre: "Fiction",
    tag: "Japanese Literature",
    image: "/images/books/book-cover-3.jpg",
    pinUrl: "https://in.pinterest.com/pin/723953708877432703/",
  },
  {
    id: "pin-4",
    title: "Poster Chữ & Typo Bìa Sách",
    subtitle: "Thiết kế đồ họa & mỹ thuật ấn phẩm",
    genre: "Other",
    tag: "Graphic & Typo",
    image: "/images/books/book-cover-4.jpg",
    pinUrl: "https://in.pinterest.com/pin/1100707965149169309/",
  },
];

export default function BookCarousel() {
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Duplicate 3 times to guarantee smooth, seamless infinite loop across any ultra-wide screen
  const booksToDisplay = [...FEATURED_BOOKS, ...FEATURED_BOOKS, ...FEATURED_BOOKS, ...FEATURED_BOOKS];

  return (
    <section className="relative z-10 py-12 lg:py-16 w-full overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-700 text-xs font-bold mb-3 shadow-[0_2px_10px_rgba(2,132,199,0.08)]">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Góc Cảm Hứng • Tuyển Chọn Bìa Sách</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Khám Phá Những Bìa Sách Tuyệt Mỹ
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl">
              Thưởng thức nghệ thuật thiết kế bìa sách độc đáo, khơi gợi cảm hứng ghi nhận hành trình đọc sách của riêng bạn mỗi ngày.
            </p>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDirection("right")}
              title="Chạy sang phải"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                direction === "right"
                  ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/20"
                  : "bg-white/90 text-slate-700 border-sky-100 hover:border-sky-300 hover:bg-white"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Tiếp tục chạy" : "Tạm dừng"}
              className="p-2.5 rounded-xl border border-sky-100 bg-white/90 text-slate-700 hover:border-sky-300 hover:bg-white transition-all cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4 fill-slate-700" /> : <Pause className="w-4 h-4 fill-slate-700" />}
            </button>
            <button
              type="button"
              onClick={() => setDirection("left")}
              title="Chạy sang trái"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                direction === "left"
                  ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/20"
                  : "bg-white/90 text-slate-700 border-sky-100 hover:border-sky-300 hover:bg-white"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Outer Viewport with Frosted Fade Gradients */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-20" />
        
        {/* Right Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-20" />

        {/* Marquee Motion Track */}
        <div
          ref={marqueeRef}
          className={`flex gap-6 sm:gap-8 items-center ${
            direction === "left" ? "animate-marquee-infinite" : "animate-marquee-infinite-reverse"
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {booksToDisplay.map((book, idx) => (
            <div
              key={`${book.id}-${idx}`}
              className="w-[210px] sm:w-[250px] shrink-0 group relative flex flex-col transition-all duration-300"
            >
              {/* 3D Realistic Book Card Container */}
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_16px_35px_-8px_rgba(2,132,199,0.22)] border border-sky-100 bg-white group-hover:shadow-[0_25px_50px_-10px_rgba(2,132,199,0.4)] group-hover:-translate-y-2 group-hover:scale-[1.03] transition-all duration-300">
                {/* Book Cover Image */}
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 210px, 250px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Physical Book Spine Highlight & Depth Fold */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/45 via-black/15 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 left-3 w-1 bg-white/25 z-10" />

                {/* Top Glass Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/75 backdrop-blur-md text-white border border-white/20 shadow-sm flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-sky-400 fill-sky-400" />
                    <span>{book.genre}</span>
                  </span>
                </div>

                {/* Bottom Overlay Glow on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 pt-12 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between z-10">
                  <a
                    href={book.pinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-300 hover:text-white transition-colors cursor-pointer bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-400/30"
                  >
                    <span>Xem Pinterest</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Book Metadata Under Cover */}
              <div className="mt-3.5 px-1 space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-sky-600 block">
                  {book.tag}
                </span>
                <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {book.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChapterContent = ({ chapter, content }) => {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };
  const router = useRouter();

  return (
    <div className="p-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex gap-1 text-primary hover:underline mb-4"
      >
        <IoMdArrowRoundBack className="text-primary text-2xl" /> Back
      </button>

      <h2 className="font-medium text-2xl">{chapter?.name}</h2>
      <p className="text-gray-500 ">{chapter?.about}</p>

      {/* Video */}
      <div className="flex justify-center my-6">
        <YouTube videoId={content?.videoId} opts={opts} />
      </div>

      {/* Content */}
      <div className="">
        {content?.content?.map((item, index) => (
          <div className="p-5 bg-sky-50 mb-3 rounded-lg" key={index}>
            <h2 className="font-medium text-lg mb-2">{item?.title}</h2>
            <ReactMarkdown>{item?.explanation}</ReactMarkdown>
            {item?.code && (
              <div className="p-4 bg-black text-white rounded-md mt-3">
                <pre>
                  <code>{item.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterContent;

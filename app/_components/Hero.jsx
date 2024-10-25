import React from "react";

function Hero() {
  return (
    <section className="bg-gray-50 h-full flex items-center justify-center">
      <div className="mx-auto max-w-screen-xl text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl text-primary">
          AI Course Generator
          <strong className="font-extrabold text-black sm:block">
            {" "}
            Custom Learning Path Using AI
          </strong>
        </h1>

        <p className="mt-4 sm:text-xl">
          Unlock personalized education with AI-driven course creation. Tailor
          your learning journey to fit your unique goals and pace.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow 
            hover:bg-[#5a189a] active:bg-[#7b2cbf] 
            transition duration-300 ease-in-out 
            focus:outline-none focus:ring sm:w-auto"
            href="#"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;

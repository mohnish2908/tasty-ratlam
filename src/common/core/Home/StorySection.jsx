import React from "react";
import GroupPhoto from "../../../assets/GroupPhoto.jpg";

const StorySection = () => {
  return (
    <section className="flex justify-center items-center min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src={GroupPhoto}
            alt="Group"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center lg:text-left">
            Our Story...
          </h1>

          {/* Paragraphs */}
          <div className=" text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed text-center lg:text-left space-y-4">
            <p>
              We headed to Nainital for a project, excited for the fresh air and scenic
              views. But soon enough, we started craving the one thing that tasted like
              home: namkeen. Store-bought snacks just didn’t cut it – they lacked the
              authentic, spicy kick we were used to.
            </p>
            <p>
              So, whenever <span className="underline font-bold"><a href="https://www.instagram.com/hey.pulkit/">Pulkit</a></span> (left, in white) went back to Ratlam, I (
              <span className="underline font-bold">Anuj</span>, right, also in white)
              eagerly awaited his return, knowing he’d bring our favorite namkeen along.
              Our friends there quickly got hooked too, asking, “Where can we get more of
              this?” That was our lightbulb moment. We thought, why not bring this
              authentic, Ratlami experience to everyone, anywhere? And that’s how{" "}
              <span className="font-semibold">TastyRatlam</span> was born – born from a
              craving, a connection, and a love for sharing the flavors of home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
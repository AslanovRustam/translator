"use client";
import React, { useState } from "react";
import axios from "axios";
import s from "./translator.module.css";

function Translator() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleOnRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => `${prev} ${transcript}`);

      const { data } = await axios.post("/api/translate", {
        text: transcript,
        language: "en-US",
      });
      setTranslation(data.text);
    };
    setIsActive(!isActive);
  };

  return (
    <div className={s.container}>
      Translator
      <textarea type="area" className={s.area} rows="5" value={text} />
      <p>{translation}</p>
      <button type="button" onClick={handleOnRecord} className={s.btn}>
        {isActive ? "Stop" : "Record"}
      </button>
    </div>
  );
}

export default Translator;

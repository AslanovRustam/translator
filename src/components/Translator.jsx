"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Flex, Typography, Input, Select } from "antd";
import { languages } from "@/data/language";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function Translator() {
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isActive, setIsActive] = useState(false);
  const [isTranslating, setTranslating] = useState(false);
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState(null);
  const [position, setPosition] = useState("end");

  useEffect(() => {
    let utterance = new SpeechSynthesisUtterance(translation);
    window.speechSynthesis.speak(utterance);
  }, [translation]);

  const handleOnRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.start();
    setIsActive(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const textToTranslate = `${text} ${transcript}`;
      setText(textToTranslate);
      try {
        const { data } = await axios.post("/api/translate", {
          text: textToTranslate,
          language: selectedLanguage,
        });
        setTranslation(data.text);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsActive(false);
      }
    };
  };

  const onTextAreaChange = (e) => {
    setText(e.target.value);
  };

  const onSelectChange = (value) => {
    setSelectedLanguage(value);
  };

  const onTranslate = () => {
    setTranslating(true);
    (async function getTranslate() {
      try {
        const { data } = await axios.post("/api/translate", {
          text: text,
          language: selectedLanguage,
        });
        setTranslation(data.text);
      } catch (error) {
        setError(error.message);
      } finally {
        setTranslating(false);
      }
    })();
  };

  return (
    <Flex vertical gap={16} className="container">
      <Title style={{ textTransform: "uppercase" }}> Translator</Title>
      <Select
        showSearch
        onChange={onSelectChange}
        defaultValue={selectedLanguage}
      >
        {languages.map((item) =>
          Object.entries(item).map(([key, value]) => (
            <Select.Option value={key}>{value}</Select.Option>
          ))
        )}
      </Select>
      <TextArea
        rows={4}
        placeholder="maxLength is 6"
        autoSize={{ minRows: 4 }}
        value={text}
        onChange={onTextAreaChange}
      />
      {error && <Paragraph>Something went wrong, {error}</Paragraph>}
      <Flex gap="middle" justify="space-evenly">
        <Button
          type="primary"
          iconPosition={position}
          loading={isTranslating ? true : false}
          onClick={onTranslate}
          className="button"
        >
          Translate
        </Button>
        <Button
          type="primary"
          danger={isActive ? true : false}
          onClick={handleOnRecord}
          className="button"
        >
          {isActive ? "Stop" : "Record"}
        </Button>
      </Flex>
      {translation && (
        <Text keyboard className="translations">
          {translation}
        </Text>
      )}
    </Flex>
  );
}

export default Translator;

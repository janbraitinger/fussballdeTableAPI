import React, { useState } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import styles from "./index.module.css";
import { FiCopy } from "react-icons/fi";


function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.headerGrid}>
          <div className={styles.headerColumn}>
            <h1 className="hero__title">
            <a href="/" className="no-decoration" style={{ textDecoration: 'none' , color: 'black'}}>Fußball.de Tabellen </a>
              <p style={{ color: "#4099C6" }}>API Generator</p>
            </h1>
            <code>Version: Alpha</code>
          </div>
          <div className={styles.headerColumn}>
            <img src="img/logo.png" className={styles.logo} alt="Logo" />
          </div>
        </div>
      </div>
    </header>
  );
}

const copyToClipboard = (event) => {
  event.preventDefault();
  const input = document.getElementById("result");
  if (input.value !== "" && input.value !== input.placeholder) {
    input.select();
    document.execCommand("copy");
  }
};

function Form() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    var key = input1;
    var website = input2;

    if (key.trim().length === 0) {
      setResult("Bitte fülle beide Felder aus!");
      return
    }
    
    if (website.trim().length === 0) {
      setResult("Bitte fülle beide Felder aus!");
      return
    }
    

    try {
      const rawResponse = await fetch("http://localhost:3001/api/v1/newAPI", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: key, website: website }),
      });
      const content = await rawResponse.json();

      if (content.success == true) {
        var url = "http://localhost:3001/api/v1/" + key + "/" + website;
        setResult(url);
      } else {
        setResult("Aus deinen Eingaben konnte keine API generiert werden");
      }
    } catch (error) {
      console.error(error);
      setResult("ERROR");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <div>
          <input
            type="text"
            id="input1"
            placeholder="Schlüssel"
            value={input1}
            onChange={(event) => setInput1(event.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            id="input2"
            placeholder="Webseite"
            value={input2}
            onChange={(event) => setInput2(event.target.value)}
          />
        </div>
        <div>
          <button className={styles.generateBtn} type="submit">
            API generieren
          </button>
        </div>
      </div>

      <div className={styles.inputWrapper2}>
        <input
          className={`${styles.urlInput} ${
            result === "ERROR" ? styles.error : ""
          }`}
          type="text"
          id="result"
          placeholder="Dein API Link erscheint nach dem generieren hier"
          value={result}
          readOnly
        />

        <button className={styles.copyButton} onClick={copyToClipboard}>
          <FiCopy />
        </button>
      </div>
    </form>
  );
}

export default function MyReactPage() {
  return (
    <Layout title={"Tabelle"}>
      <HomepageHeader />

      <div className={styles.container}>
        <div className={styles.column}>
          <Form />
        </div>
        <div className={styles.column}>
          <p className={styles.textWrapper}>
            Mit unserem kostenlosen Tool kannst Du dein Tabellen-Widget von
            Fußball.de schnell und einfach in eine API umwandeln. Alle Daten
            werden als JSON Nachricht unter dem entsprechenden Endpunkt
            bereitgestellt. Allgemein ist die API ansteuerbar über{" "}
            <code>/api/v1/schlüssel/webseite</code>. Durch den Tag <i>show</i>{" "}
            kannst du die Tabelle direkt im Browser anschauen{" "}
            <code>
            /api/v1/<b>show</b>/schlüssel/webseite
            </code>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import styles from "./index.module.css";
import { FiCopy } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Link } from 'react-router-dom';



function CodeSnippet() {
    const codeString = `     
    const axios = require('axios');
    const cheerio = require('cheerio');
    
    async function scrapeUserData(key, website) {

        const url = 'https://www.fussball.de/widget2/-/schluessel/' + key + '/target/widget1/caller/' + website;
    
        try {
    
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
    
    
            const data = [];
            $('tbody tr').each(function(index) {
                const $tds = $(this).find('td');
                const position = index + 1;
                const $clubWrapper = $tds.eq(2).find('.club-wrapper');
                const clubName = $clubWrapper.find('.club-name').text().trim();
                const gamesPlayed = $tds.eq(3).text().trim();
                const goalDiff = $tds.eq(4).text().trim();
                const points = $tds.eq(5).text().trim();
                const imgUrl = $clubWrapper.find('.club-logo img').attr('src');
                const logo = imgUrl.replace(/^\/\//, 'https://');
    
                data.push({
                    position,
                    clubName,
                    gamesPlayed,
                    goalDiff,
                    points,
                    logo,
                });
            });
            return data;
        } catch(error) {
            console.log("Error in scrapeData()")
            return JSON.parse('{}');
        }
    }`;
  
    return (
      <SyntaxHighlighter language="javascript" style={docco}>
        {codeString}
      </SyntaxHighlighter>
    );
  }

  

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.headerGrid}>
          <div className={styles.headerColumn}>
          <h1 className="hero__title" >
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


export default function MyReactPage() {
    return (
      <Layout title={"Tabelle"}>
        
        <HomepageHeader />
        <div className={styles.oneContainer}>
            <p>
            Die folgende Prozedur basiert auf Node.js und nutzt zusätzlich npm-Pakete wie Axios und Cheerio. Im ersten Schritt wird ein normaler HTTP-Request an Fußball.de mit den vordefinierten Parametern "Schlüssel" und "Webseite" gesendet. Diese Daten werden beim Erstellen eines Widgets angegeben und sind für den Request erforderlich. Dadurch wird eine HTML-Seite mit der eigentlichen Tabelle zurückgegeben. Mithilfe von DOM Scraping werden die relevanten Informationen aus der Tabelle extrahiert und als JSON bereitgestellt.
            </p>
        <CodeSnippet />
        Bei Fragen wende dich bitte an <code>help@table-api.net</code>
        </div>
      </Layout>
    );
  }
  

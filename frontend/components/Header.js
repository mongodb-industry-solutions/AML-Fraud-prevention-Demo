//'use client'
import React from 'react';
import styles from '../styles/header.module.css';
import { MongoDBLogoMark } from '@leafygreen-ui/logo';
import { H2,Body }  from '@leafygreen-ui/typography';

function Header() {
  return (
    <div className={styles["layout-header"]}>
      <div className={styles["logo-container"]}>
        <MongoDBLogoMark />
      </div>
      <div className={styles["title-container"]}>
        <H2>MongoDB Vector Search and OpenAI Embeddings Demo for Combating AML and Fraud</H2>
      </div>
      <div className={styles["logout-container"]}>
      <a href="/login"><Body>Log Out</Body></a>
      </div>
    </div>

  );
}

export default Header;


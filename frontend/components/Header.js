//'use client'
import React from 'react';
import styles from '../styles/header.module.css';
import { MongoDBLogoMark } from '@leafygreen-ui/logo';
import { H2,Body }  from '@leafygreen-ui/typography';
import Link from 'next/link';
 
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
        <Link href="/login">
          <Body style={{ cursor: 'pointer' }}>Log Out</Body>
        </Link>
      </div>
    </div>

  );
}

export default Header;


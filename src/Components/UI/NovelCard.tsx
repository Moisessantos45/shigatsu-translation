import React from "react";
import styles from "@/Css/NovelCard.module.css";

interface NovelCardProps {
  imageUrl: string;
  title: string;
  description: string;
  type: string;
}

const NovelCard: React.FC<NovelCardProps> = ({
  imageUrl,
  title,
  description,
  type,
}) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.image} />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.type}>{type}</span>
      </div>
    </div>
  );
};

export default NovelCard;

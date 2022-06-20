import React from 'react';
import { Card } from 'react-bootstrap';
import { Post } from '../../interfaces/cms';
import style from '../../styles/unauthenticated.module.css';

function FeaturedPost({ post }:{post:Post}) {
  return (
    <div key={post.id}>
      <p className={style['menu-name']}>{post.postTitle}</p>
      <Card className={`bg-dark text-white ${style['featured-post']}`}>
        <Card.Img
          data-testid="mainImage"
          className={style['featured-post-img']}
          src={post.mainImage.url}
          alt={post.mainImage.url}
        />
        <Card.ImgOverlay>
          <p id={style['featured-post-sub-head']}>{post.imageCaption}</p>
          <div
            tabIndex={0}
            className={style['title-box']}
            role="button"
            onKeyDown={() => {
              window.open(post.postUrl, '_blank');
            }}
            onClick={() => {
              window.open(post.postUrl, '_blank');
            }}
          >
            <span>LEARN MORE</span>
          </div>
        </Card.ImgOverlay>
      </Card>
      <div className={style['post-description-box']}>
        <img
          data-testid="secondaryImage"
          className={style['featured-post-secondary-img']}
          src={post.secondaryImage.url}
          alt={post.secondaryImage.url}
        />
        <div className={style['post-description-text']}>
          <p>{post.fullDescription}</p>
        </div>
      </div>
    </div>
  );
}

export default FeaturedPost;

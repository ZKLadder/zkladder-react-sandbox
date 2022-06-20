import React from 'react';
import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import { useRecoilValue } from 'recoil';
import Error from '../shared/Error';
import style from '../../styles/unauthenticated.module.css';
import { postsState } from '../../state/cms';
import FeaturedPost from './FeaturedPost';

function PostsMenu() {
  const posts = useRecoilValue(postsState);

  if (!posts.loaded) {
    return null;
  }

  if (posts.error.length) return <Error text={posts.error} />;

  return (
    <div className={style['post-menu']}>
      <Glider
        draggable
        hasArrows
        hasDots
        slidesToShow={1}
        slidesToScroll={3}
        responsive={[
          {
            breakpoint: 450,
            settings: {
              slidesToShow: 1,
            },
          },
          {
            breakpoint: 1000,
            settings: {
              slidesToShow: 1.5,
            },
          },
          {
            breakpoint: 1700,
            settings: {
              slidesToShow: 2,
            },
          },
        ]}
      >
        {posts.posts.map((post) => (
          <FeaturedPost post={post} />
        ))}

        {/* return (
            <div key={category.id}>
              <p className={style['menu-name']}>{category.name.toUpperCase()}</p>
              <Card className={`bg-dark text-white ${style.posts}`} id={i + 1}>
                <Card.Img
                  className={style['post-img']}
                  src={category.posts[0].images[0].url}
                  alt={category.posts[0].images[0].fileName}
                />
                <Card.ImgOverlay>
                  <p>{category.posts[0].subHeadline.toUpperCase()}</p>
                  <div className={style['title-box']}>
                    <span>LEARN MORE</span>
                  </div>
                </Card.ImgOverlay>
              </Card>
            </div>
          );
        }) */}
      </Glider>
    </div>
  );
}

export default PostsMenu;

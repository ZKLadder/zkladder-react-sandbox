import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Row, Col, Card } from 'react-bootstrap';

export const POSTS = gql`
  {
    postCategories {
      name
      id
      posts(last: 1) {
        title
        id
        subHeadline
        fullDescription
        images {
          fileName
          url
        }
        slug
        text {
          markdown
        }
      }
    }
  }
`;

function PostsMenu() {
  const { loading, error, data } = useQuery(POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <h1>
        Error:
        {error.message}
      </h1>
    );
  }

  return (
    <div className="post-menu">
      <Row>
        {data.postCategories.map((category: any, i: any) => {
          if (category.name === 'Featured DAO') {
            return (
              <Col key={category.id}>
                <p className="menu-name">{category.name.toUpperCase()}</p>
                <Card className="bg-dark text-white featured-dao" id="featured-dao">
                  <Card.Img
                    className="featured-dao-img"
                    src={category.posts[0].images[0].url}
                    alt={category.posts[0].images[0].fileName}
                  />
                  <Card.ImgOverlay>
                    <p id="featured-dao-sub-head">{category.posts[0].subHeadline.toUpperCase()}</p>
                    <div className="title-box">
                      <span>LEARN MORE</span>
                    </div>
                  </Card.ImgOverlay>
                </Card>
                <div className="post-description-box">
                  <img
                    className="featured-dao-secondary-img"
                    src={category.posts[0].images[1].url}
                    alt={category.posts[0].images[1].fileName}
                  />
                  <div className="post-description-text">
                    <h4><b>{category.posts[0].title.toUpperCase()}</b></h4>
                    <p>{category.posts[0].fullDescription}</p>
                  </div>
                </div>
              </Col>
            );
          }

          return (
            <Col key={category.id}>
              <p className="menu-name">{category.name.toUpperCase()}</p>
              <Card className="bg-dark text-white posts" id={i + 1}>
                <Card.Img
                  className="post-img"
                  src={category.posts[0].images[0].url}
                  alt={category.posts[0].images[0].fileName}
                />
                <Card.ImgOverlay>
                  <p>{category.posts[0].subHeadline.toUpperCase()}</p>
                  <div className="title-box">
                    <span>LEARN MORE</span>
                  </div>
                </Card.ImgOverlay>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default PostsMenu;

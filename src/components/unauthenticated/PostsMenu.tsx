import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Row, Col, Card } from 'react-bootstrap';

const POSTS = gql`
  {
    posts(last: 3) {
      title
      description
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
`;

function PostsMenu() {
  const { loading, error, data } = useQuery(POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="post-menu">
      <Row>
        {/* TODO: create cards to match UI mockups */}
        {data.posts.map((post: any) => (
          <Col key={post.id}>
            <Card className="bg-light text-white posts">
              <Card.Img className="post-img" src={post.images[0].url} alt={post.images[0].fileName} />
              <Card.ImgOverlay>
                <div className="title-box">
                  <span>{post.title.toUpperCase()}</span>
                </div>
              </Card.ImgOverlay>
            </Card>
            {post.description}
          </Col>
        ))}
      </Row>
    </div>
  );
  /* const [posts, setPosts] = useState<Post[]>();

  interface Post {
    title:string,
    description:string,
    images:Array<Image>,
    slug:string,
    text:{
      markdown:string
    }
  }

  interface Image {
    fileName:string,
    url:string
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const { latestPosts } = await request(
        'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master',
        ``,
      );
      setPosts(latestPosts);
    }; fetchPosts();
  });

  const renderPosts = () => posts.map((post) => (
    <Col>
      <h1>{post.title}</h1>
      <h2>{post.description}</h2>
      <img src={post.images[0].url} alt={post.images[0].fileName} />
      {post.text.markdown}
    </Col>
  ));

  return (
    <div>
      {!posts ? (
        <h1>
          Loading...
        </h1>
      ) : (
        <Row>
          {renderPosts()}
        </Row>
      )}
    </div>
  ); */
}

export default PostsMenu;

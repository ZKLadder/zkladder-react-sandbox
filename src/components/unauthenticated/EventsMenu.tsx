import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Row, Col, Card } from 'react-bootstrap';

const EVENTS = gql`
  query UpcomingEvents {
    events(last: 3) {
      title
      date
      description
      image {
        url
        fileName
      }
    }
  }
`;

function EventsMenu() {
  const { loading, error, data } = useQuery(EVENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="events-menu">
      <Row>
        {/* TODO: create cards to match UI mockups */}
        {data.events.map((event: any) => (
          <Col key={event.id}>
            <Card className="bg-light text-white events">
              <Card.Img className="event-img" src={event.image.url} alt={event.image.fileName} />
              <Card.ImgOverlay>
                <div className="title-box">
                  <span>{event.title.toUpperCase()}</span>
                </div>
                <h3>{event.date}</h3>
              </Card.ImgOverlay>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
  /* const [events, setEvents] = useState<Event[]>();

  interface Event {
    title:string,
    date:string,
    description:string,
    image:{
      url:string,
      fileName:string
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const { latestEvents } = await request(
        'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master',
        `{
          events(last: 3, after: "${new Date()}") {
            title
            date
            description
            image {
              url
              fileName
            }
          }
        }`,
      );
      setEvents(latestEvents);
    }; fetchEvents();
  });

  const renderEvents = () => events.map((event) => (
    <Col>
      <h1>{event.title}</h1>
      <h2>{event.date}</h2>
      <img src={event.image.url} alt={event.image.fileName} />
    </Col>
  ));

  return (
    <div>
      {!events ? (
        <h1>
          Loading...
        </h1>
      ) : (
        <Row>
          {renderEvents()}
        </Row>
      )}
    </div>
  ); */
}

export default EventsMenu;

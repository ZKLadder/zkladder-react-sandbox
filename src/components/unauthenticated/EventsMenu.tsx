import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import Glider from 'react-glider';
import 'glider-js/glider.min.css';

export const EVENTS = gql`
  query UpcomingEvents {
    events(last: 4, orderBy: date_ASC) {
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

  const formatDate = (date: any) => {
    const dateTimeString = new Date(date).toString();
    const dateAsArray = dateTimeString.split(' ');
    const dateString = dateAsArray[0].concat(' ', dateAsArray[1], ' ', dateAsArray[2]);
    return dateString;
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <div>
        <h1>Error:</h1>
        <h2>{error.message}</h2>
      </div>
    );
  }

  return (
    <div className="events-menu">
      <p className="menu-name">UPCOMING EVENTS</p>
      <Glider
        draggable
        hasDots
        slidesToShow={2}
        slidesToScroll={3}
        responsive={[
          {
            breakpoint: 1450,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 3,
            },
          },
        ]}
      >
        {data.events.map((event: any) => (
          <div key={event.id}>
            <Card className="bg-light text-white events">
              <Card.Img className="event-img" src={event.image.url} alt={event.image.fileName} />
              <Card.ImgOverlay>
                <div className="date-box">
                  <span>{formatDate(event.date).toUpperCase()}</span>
                </div>
                <h3 className="event-title">{event.title.toUpperCase()}</h3>
              </Card.ImgOverlay>
            </Card>
          </div>
        ))}
      </Glider>
    </div>
  );
}

export default EventsMenu;

import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Card from 'react-bootstrap/Card';
import Glider from 'react-glider';
import Loading from '../shared/Loading';
import Error from '../shared/Error';
import 'glider-js/glider.min.css';
import style from '../../styles/unauthenticated.module.css';

const endpoint = 'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master';

export const EVENTS = `
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
  const {
    data,
    isLoading,
    isError,
  } = useQuery('events', () => axios({
    url: endpoint,
    method: 'POST',
    data: {
      query: EVENTS,
    },
  }).then((response) => response.data.data));

  const formatDate = (date: any) => {
    const dateTimeString = new Date(date).toString();
    const dateAsArray = dateTimeString.split(' ');
    const dateString = dateAsArray[0].concat(' ', dateAsArray[1], ' ', dateAsArray[2]);
    return dateString;
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error text="We are sorry, an error has occurred." />;

  return (
    <div className={style['events-menu']}>
      <p className={style['menu-name']}>UPCOMING EVENTS</p>
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
            <Card className={`bg-light text-white ${style.events}`}>
              <Card.Img className={style['event-img']} src={event.image.url} alt={event.image.fileName} />
              <Card.ImgOverlay>
                <div className={style['date-box']}>
                  <span>{formatDate(event.date).toUpperCase()}</span>
                </div>
                <h3 className={style['event-title']}>{event.title.toUpperCase()}</h3>
              </Card.ImgOverlay>
            </Card>
          </div>
        ))}
      </Glider>
    </div>
  );
}

export default EventsMenu;

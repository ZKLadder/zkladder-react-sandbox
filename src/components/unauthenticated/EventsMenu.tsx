import React from 'react';
import Card from 'react-bootstrap/Card';
import Glider from 'react-glider';
// import Error from '../shared/Error';
import 'glider-js/glider.min.css';
import style from '../../styles/unauthenticated.module.css';

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
  // const [error, setError] = useState(null);
  /* const {
    data,
    isLoading,
  } = useQuery('events', () => axios({
    url: endpoint,
    method: 'POST',
    data: {
      query: EVENTS,
    },
  }).then((response) => response.data.data).catch((err) => setError(err.message))); */

  const formatDate = (date: any) => {
    const dateTimeString = new Date(date).toString();
    const dateAsArray = dateTimeString.split(' ');
    const dateString = dateAsArray[0].concat(' ', dateAsArray[1], ' ', dateAsArray[2]);
    return dateString;
  };

  // if (isLoading) return <Loading />;
  // if (error !== null) return <Error text={error as any} />;

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
        {[].map((event: any) => (
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

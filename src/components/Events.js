import React, { Component } from 'react';
import { format, isToday } from 'date-fns';
import * as locale from 'date-fns/locale/nb';

export default class Events extends Component {
  render() {
    let EventsUI = null;
    switch (this.props.type) {
      case 'splash':
        EventsUI = EventsFromSplash;
        break;
      case 'carousel':
        EventsUI = EventsCarousel;
        break;
      default:
        EventsUI = EventsCarousel;
    }
    const { events = [] } = this.props;
    const now = Date.now();
    const eventsMapped = events
      .filter(e => now <= new Date(e.startDate).getTime())
      .map(e => {
        const startDateTime = e.startDate;
        const startDateFormatted = isToday(startDateTime)
          ? 'I dag'
          : format(startDateTime, 'dddd D. MMM', {
              locale,
            });
        const startTimeFormatted = format(startDateTime, 'HH:MM', { locale });
        const endDateTime = e.endDate;
        const endDateFormatted = isToday(endDateTime)
          ? 'I dag'
          : format(endDateTime, 'dddd D. MMM', { locale });
        const endTimeFormatted = format(endDateTime, 'HH:MM', { locale });
        const title = e.title;
        const image = e.image;
        const companyImage = e.companyImage;

        return {
          startDate: new Date(startDateTime),
          startDateFormatted,
          startTimeFormatted,
          endDate: new Date(endDateTime),
          endDateFormatted,
          endTimeFormatted,
          title,
          image: image || companyImage,
        };
      })
      .sort((a, b) => a.startDate - b.startDate);
    return <EventsUI {...this.props} events={eventsMapped} />;
  }
}

class EventsFromSplash extends Component {
  render() {
    const {
      events = [],
      lineColor = '#ddd',
      dateColor = '#f80',
      timeColor = 'rgba(160, 160, 160, .8)',
    } = this.props;
    const eventList = events.slice(1).map((e, i) => {
      const { startDateFormatted, startTimeFormatted, title } = e;
      const style = {};

      return (
        <div key={i} className="event event-splash" style={style}>
          <span className="title">{title}</span>
          <span className="start-date">{startDateFormatted}</span>
          <span className="start-time">{startTimeFormatted}</span>
        </div>
      );
    });

    const firstEvent = events[0] || {};

    return (
      <>
        <style scoped>
          {`
          .event-list {
            display: flex;
            flex-direction: column;
            max-width: 800px;
            margin: auto;
          }
          .main-event {
            max-width: 800px;
            margin: auto;
            display: flex;
            flex-direction: column;
            min-height: 160px;
            padding: 32px 24px;
            box-sizing: border-box;
          }
          .main-title {
            font-size: 2em;
            color: #fff;
          }
          .main-start-datetime:first-letter {
            text-transform: capitalize;
          }
          .main-start-datetime {
            margin: 10px 0 0 50px;
          }
          .main-start-datetime::before {
            content: '- ';
          }
          .event {
            display: flex;
          }
          .title {
            order: 3;
            flex: 1 1 auto;
            position: relative;
            border-left: 3px solid ${lineColor};
            padding: 10px 0 10px 42px;
          }
          .title::before {
            content: '';
            position: absolute;
            right: calc(100% - 5px);
            top: 18px;
            background-color: ${lineColor};
            width: 14px;
            height: 14px;
            border-radius: 7px;
          }
          .event:last-child .title {
            padding-bottom: 32px;
          }
          .start-date:first-letter {
            text-transform: capitalize;
          }
          .start-date {
            order: 1;
            flex: 0 0 240px;
            text-align: right;
            color: ${dateColor};
            padding: 10px 0;
          }
          .start-time {
            order: 2;
            flex: 0 0 80px;
            text-align: center;
            font-size: .75em;
            color: ${timeColor};
            padding: 14px 10px 10px 0;
          }
          `}
        </style>
        <div className="main-event">
          <span className="main-title">{firstEvent.title}</span>
          <span className="main-start-datetime">
            {firstEvent.startDateFormatted} klokken{' '}
            {firstEvent.startTimeFormatted}
          </span>
        </div>
        <div className="event-list">{eventList}</div>
      </>
    );
  }
}

class EventsCarousel extends Component {
  render() {
    const {
      events = [],
      //lineColor = '#ddd',
      //dateColor = '#f80',
      //timeColor = 'rgba(160, 160, 160, .8)',
    } = this.props;
    const eventList = events.slice(1).map((e, i) => {
      const { startDateFormatted, startTimeFormatted, title } = e;
      const style = {};

      return (
        <div key={i} className="event event-splash" style={style}>
          <span className="title">{title}</span>
          <span className="start-date">{startDateFormatted}</span>
          <span className="start-time">{startTimeFormatted}</span>
        </div>
      );
    });

    const firstEvent = events[0] || {};

    return (
      <>
        <style scoped>
          {`
          .event-list {
          }
          .main-event {
          }
          .main-title {
          }
          .main-start-datetime {
          }
          .event {
          }
          .title {
          }
          .title::before {
          }
          .event:last-child .title {
          }
          .start-date {
          }
          .start-time {
          }
          `}
        </style>
        <div className="main-event">
          <span className="main-title">{firstEvent.title}</span>
          <span className="main-start-datetime">
            {firstEvent.startDateFormatted}
            &nbsp;&nbsp;
            {firstEvent.startTimeFormatted}
          </span>
        </div>
        <div className="event-list">{eventList}</div>
      </>
    );
  }
}
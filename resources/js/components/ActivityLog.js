import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css'
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import moment from "moment";
import Table from './Table';

export default class ActivityLog extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.data)
    console.log(typeof (this.props.data))
    this.data = this.props.data;
  }
  render() {
    const today = new Date();
    var game_records_object = {}
    if (this.data)
      game_records_object = JSON.parse(this.data)
    const formatted_date_records_object = {}

    $.each(game_records_object, function (key, value) {
      // console.log("key : " + key)
      if (formatted_date_records_object.hasOwnProperty(moment(+key).format("DD/MM/YYYY"))) {

        //When date key is present of current date
        Object.assign(formatted_date_records_object[moment(+key).format("DD/MM/YYYY")], value);
      } else {

        //When no predefined key is present of current date
        formatted_date_records_object[moment(+key).format("DD/MM/YYYY")] = value;
      }
      // console.log("date : " + moment(+key).format("DD/MM/YYYY"))
    })

    const randomValues = getRange(200).map(index => {
      if (formatted_date_records_object.hasOwnProperty(convert(shiftDate(today, -index)))) {
        return {
          date: shiftDate(today, -index),
          count: Object.keys(formatted_date_records_object[convert(shiftDate(today, -index))]).length
        };
      } else {
        return {
          date: shiftDate(today, -index),
          count: 0,
        };
      }
    });

    function convert(str2) {
      var mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
      },
        date = str2.toDateString().split(" ");
      return [date[2], mnths[date[1]], date[3]].join("/");
    }

    function shiftDate(date, numDays) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    }

    function getRange(count) {
      return Array.from({ length: count }, (_, i) => i);
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function findGameIconAddress(game_name){
      if (game_name == 'Snake') return '/images/Snake-icon-1.png';
      if (game_name == 'Flappy Bird') return '/images/Flappy-Square.png';
      if (game_name == 'Sticky Holds') return '/images/Sticky-Holds.png';
      if (game_name == 'Menja') return '/images/Menja-icon.png';
      if (game_name == 'Tetris') return '/images/Tetris.png';
      if (game_name == 'Bubble Shooter') return '/images/Bubble.png';
      if (game_name == 'Ping Pong') return '/images/Ping-Pong.png';
      if (game_name == 'Maze') return '/images/Maze.png';
      if (game_name == 'Ball Catcher') return '/images/ballcatcher.jpeg';
      if (game_name == 'Bouncing Ball') return '/images/bouncing-ball.png';
      return '/images/lazyeye-icon.svg';
    }

    function getCurrentDateRecord(temp_date) {
      console.log("formatted_date_records_object")
      console.log(formatted_date_records_object)
      let formatDate = convert(temp_date)
      $('div#log').text('')
      $('div#log').html(`<h3 class="mt-4">Activity on ${formatDate}</h3><hr/>`)
      if (formatted_date_records_object[formatDate] === undefined || formatted_date_records_object[formatDate] === null) {
        $('thead').text('')
        $('tbody').text('')
        $('thead').append(`<tr class="text-danger"><th><h4>No Activities Found</h4></th></tr>`)
      }
      else {
        $('thead').text('')
        $('tbody').text('')
        $('thead').append(`<tr class="text-danger">
            <th>Game Icon</th>
            <th>Game Played</th>
            <th>Score</th>
            </tr>
            `)
        let table_data = ``
        $.each(formatted_date_records_object[formatDate], function (key, value) {
          let game_icon = findGameIconAddress(key);
          table_data += `<tr>
          <td><img src=${game_icon} style="width:2rem"></td>
            <td>${key}</td>
            <td>${value}</td>
            </tr>
            `
        })
        $('tbody').append(table_data)
      }
    }
    return (
      <>
        <div>
          <h1 className="mt-4">Activity Log</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item active">Activity Log</li>
          </ol>

          <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
            <h5 className="fw-bold mb-3 text-main"><i className="fa-solid fa-fire text-danger me-2"></i>Therapy Activity Heatmap</h5>
            <div className="overflow-auto pb-2">
              <CalendarHeatmap
                startDate={shiftDate(today, -200)}
                endDate={today}
                values={randomValues}
                classForValue={value => {
                  if (!value) {
                    return 'color-empty';
                  }
                  // return `color-github-${value.count}`;
                  if (value.count < 1)
                    return `color-github-0`;
                  else
                    return `color-github-${value.count}`;
                }}
                tooltipDataAttrs={value => {
                  return {
                    'data-tooltip-id': `my-tooltip`,
                    'data-tooltip-content': `${convert(value.date)} has ${value.count} activities`,
                    'data-tooltip-place': "top",
                  };
                }}
                showWeekdayLabels={true}
                onClick={value => getCurrentDateRecord(value.date)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2 mt-2 text-sub small">
              <span>Less</span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: 'var(--border-color)' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#9be9a8' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#40c463' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#30a14e' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#216e39' }}></span>
              <span>More</span>
            </div>
          </div>
          <ReactTooltip id="my-tooltip" />
          <div id='log'></div>
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
            <div className="card-header bg-transparent border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <i className="fas fa-table me-2 text-primary"></i><span className="fw-semibold">Daily Activity Details</span>
            </div>
            <div className="card-body table-responsive">
              <table id="datatablesSimple" className='table table-hover table-striped mb-0' >
                <thead className='thead-info'>

                </thead>
                <tbody>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }
}

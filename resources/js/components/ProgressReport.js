import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import moment from "moment";
import Moment from 'react-moment';
import 'moment-timezone';
export default class ProgressReport extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.data)
    this.state = {
      data: {},
    }
  }
  getTimestamp = (date) => {
    return moment(date,this.props.date_format).unix() * 1000;
  }

  getDateFromTimestamp = (timestamp) => {
    return moment(timestamp).format(this.props.date_format);
  }

  findGameIconAddress(game_name){
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
  printReport = (data) => {
    $('tbody').text('')
    let dates = Object.keys(data)
    for (let i = 0; i < dates.length; i++) {
      $('tbody').append(`<tr><td colspan="3"><h3>${dates[i]}</h3></td></tr>`)
      let game_data = Object.keys(data[dates[i]])
      console.log(game_data.length)
      if (game_data.length) {
        console.log("Run if")
        $('tbody').append(`
                           <tr>
                               <th class="text-primary"><h5>Game Icon</h5></th>
                               <th class="text-primary"><h5>Game Name</h5></th>
                                <th class="text-primary"><h5>Score</h5></th>
                            </tr>
          `);
        for (let j = 0; j < game_data.length; j++) {
          console.log(dates[i])
          console.log(data[dates[i]])
          let game_icon = this.findGameIconAddress(game_data[j]);
          $('tbody').append(`
                          <tr>
                          <td><img src=${game_icon} style="width:2rem"></td>
                          <td>${game_data[j]}</td>
                          <td>${data[dates[i]][game_data[j]]}</td>
                          </tr>
            `)
        }
      } else {
        console.log("Run else")
        $('tbody').append(`<tr>
          <td colspan="3" class="text-danger text-center"><h4>No Report Found</h4></td>
          </td>`)
      }
    }
  }

  daily_report = (temp_date) => {
    let data = {}
    if (this.props.data)
      data = JSON.parse(this.props.data)
    let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
    let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format));
    let dates = Object.keys(data)
    console.log(endDate)
    console.log(startDate)
    let start_temp_timestamp = startDate;
    let daily_data = {}
    let game_played_data = []
    let start_temp_date = ''
    while (start_temp_timestamp <= endDate) {

      start_temp_date = this.getDateFromTimestamp(start_temp_timestamp)
      daily_data[`${start_temp_date}`] = {}
      for (let i = 0; i < dates.length; i++) {
        if (this.getDateFromTimestamp(+dates[i]) === this.getDateFromTimestamp(start_temp_timestamp)) {
          game_played_data = Object.keys(data[dates[i]])
          let score = 0
          for (let j = 0; j < game_played_data.length; j++) {
            score = +data[dates[i]][game_played_data[j]]
            if (score != undefined && score != null) {
              if (daily_data[`${start_temp_date}`].hasOwnProperty(game_played_data[j])) {
                daily_data[`${start_temp_date}`][game_played_data[j]] = (score + (+daily_data[`${start_temp_date}`][game_played_data[j]])) / 2
              }
              else {
                daily_data[`${start_temp_date}`][game_played_data[j]] = score
              }
            }
          }
        }
      }
      start_temp_timestamp = start_temp_timestamp + 24 * 60 * 60 * 1000;
    }

    $('div#log').text('')
    $('div#log').html(`<h3 class="mt-4">Progress Report from ${this.getDateFromTimestamp(startDate)} To ${this.getDateFromTimestamp(endDate)}</h3><hr/>`)
    this.printReport(daily_data);
  }


  // monthly_report = (temp_date) => {
  //   let data = {}
  //   if (this.props.data)
  //     data = JSON.parse(this.props.data)
  //   let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
  //   let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format));
  //   let dates = Object.keys(data)
  //   console.log(endDate)
  //   console.log(startDate)
  //   let start_temp_timestamp = startDate;
  //   let end_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(start_temp_timestamp), this.props.date_format).add(1, 'months'));
  //   let monthly_data = {}
  //   let month_game_data = {}
  //   let game_played_data = []
  //   let start_temp_date = ''
  //   let end_temp_date = ''
  //   while (start_temp_timestamp <= endDate) {

  //     if (end_temp_timestamp > endDate)
  //       end_temp_timestamp = endDate;
  //     start_temp_date = this.getDateFromTimestamp(start_temp_timestamp)
  //     end_temp_date = this.getDateFromTimestamp(end_temp_timestamp)
  //     monthly_data[`${start_temp_date}-${end_temp_date}`] = {}
  //     for (let i = 0; i < dates.length; i++) {
  //       month_game_data = {}
  //       if (dates[i] >= start_temp_timestamp && dates[i] <= end_temp_timestamp) {
  //         game_played_data = Object.keys(data[dates[i]])
  //         let score = 0
  //         for (let j = 0; j < game_played_data.length; j++) {
  //           score = +data[dates[i]][game_played_data[j]]
  //           if (score != undefined && score != null) {
  //             if (monthly_data[`${start_temp_date}-${end_temp_date}`].hasOwnProperty(game_played_data[j])) {
  //               monthly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]] = (score + (+monthly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]])) / 2
  //             }
  //             else {
  //               monthly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]] = score
  //             }
  //           }
  //         }
  //       }
  //     }
  //     start_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(end_temp_timestamp), this.props.date_format).add(1, 'days'));
  //     end_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(start_temp_timestamp), this.props.date_format).add(1, 'months'));

  //   }

  //   $('div#log').text('')
  //   $('div#log').html(`<h3 class="mt-4">Progress Report from ${this.getDateFromTimestamp(startDate)} To ${this.getDateFromTimestamp(endDate)}</h3><hr/>`)
  //   this.printReport(monthly_data)
  // }

  weekly_report = (temp_date) => {
    let data = {}
    if (this.props.data)
      data = JSON.parse(this.props.data)
    let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
    let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format))+86399999;
    let dates = Object.keys(data)
    console.log(endDate)
    console.log(startDate)
    let start_temp_timestamp = startDate;
    let end_temp_timestamp = start_temp_timestamp + 6 * 24 * 60 * 60 * 1000;
    let weekly_data = {}
    let week_game_data = {}
    let game_played_data = []
    let start_temp_date = ''
    let end_temp_date = ''
    while (start_temp_timestamp <= endDate) {

      if (end_temp_timestamp > endDate)
        end_temp_timestamp = endDate;
      start_temp_date = this.getDateFromTimestamp(start_temp_timestamp)
      end_temp_date = this.getDateFromTimestamp(end_temp_timestamp)
      weekly_data[`${start_temp_date}-${end_temp_date}`] = {}
      for (let i = 0; i < dates.length; i++) {
        week_game_data = {}
        if (dates[i] >= start_temp_timestamp && dates[i] <= end_temp_timestamp) {
          game_played_data = Object.keys(data[dates[i]])
          let score = 0
          for (let j = 0; j < game_played_data.length; j++) {
            score = +data[dates[i]][game_played_data[j]]
            if (score != undefined && score != null) {
              if (weekly_data[`${start_temp_date}-${end_temp_date}`].hasOwnProperty(game_played_data[j])) {
                weekly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]] = (score + (+weekly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]])) / 2
              }
              else {
                weekly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]] = score
              }
            }
          }
        }
      }
      start_temp_timestamp = end_temp_timestamp + 24 * 60 * 60 * 1000;
      end_temp_timestamp = end_temp_timestamp + 7 * 24 * 60 * 60 * 1000;
    }
    $('div#log').text('')
    $('div#log').html(`<h3 class="mt-4">Progress Report from ${this.getDateFromTimestamp(startDate)} To ${this.getDateFromTimestamp(endDate)}</h3><hr/>`)
    this.printReport(weekly_data)
  }

  monthly_report = (temp_date) => {
    let data = {}
    if (this.props.data)
      data = JSON.parse(this.props.data)
    let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
    let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format))+86399999;
    let dates = Object.keys(data)
    console.log(endDate)
    console.log(startDate)
    let start_temp_timestamp = startDate;
    let end_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(start_temp_timestamp), this.props.date_format).add(1, 'months'));
    let monthly_data = {}
    let month_game_data = {}
    let game_played_data = []
    let start_temp_date = ''
    let end_temp_date = ''
    while (start_temp_timestamp < endDate) {

      if (end_temp_timestamp > endDate)
        end_temp_timestamp = endDate;
      start_temp_date = this.getDateFromTimestamp(start_temp_timestamp)
      end_temp_date = this.getDateFromTimestamp(end_temp_timestamp)
      monthly_data[`${start_temp_date}-${end_temp_date}`] = {}
      for (let i = 0; i < dates.length; i++) {
        month_game_data = {}
        if (dates[i] >= start_temp_timestamp && dates[i] <= end_temp_timestamp) {
          game_played_data = Object.keys(data[dates[i]])
          let score = 0
          for (let j = 0; j < game_played_data.length; j++) {
            score = +data[dates[i]][game_played_data[j]]
            if (score != undefined && score != null) {
              if (monthly_data[`${start_temp_date}-${end_temp_date}`].hasOwnProperty(game_played_data[j])) {
                monthly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]] = (score + (+monthly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]])) / 2
              }
              else {
                monthly_data[`${start_temp_date}-${end_temp_date}`][game_played_data[j]] = score
              }
            }
          }
        }
      }
      start_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(end_temp_timestamp), this.props.date_format).add(1, 'days'));
      end_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(start_temp_timestamp), this.props.date_format).add(1, 'months'));

    }
    $('div#log').text('')
    $('div#log').html(`<h3 class="mt-4">Progress Report from ${this.getDateFromTimestamp(startDate)} To ${this.getDateFromTimestamp(endDate)}</h3><hr/>`)
    this.printReport(monthly_data)
  }


  getCurrentDateRecord = (temp_date) => {
    let report_timeperiod_type = $('select#report_timeperiod_type').val()
    let timeperiod_type = '', add_timeperiod = 0;
    console.log("report_timeperiod_type : " + report_timeperiod_type)
    if (report_timeperiod_type == 'Daily') {
      this.daily_report(temp_date)
    } else if (report_timeperiod_type == 'Monthly') {
      this.monthly_report(temp_date)
    }
    else {
      this.weekly_report(temp_date)
    }

  }
  render() {

    return (
      <div>
        <h1 className="mt-4">Progress Report</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Progress Report</li>
        </ol>
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', maxWidth: '750px' }}>
          <h5 className="fw-bold mb-3 text-main"><i className="fa-solid fa-chart-line text-primary me-2"></i>Filter Date & Period</h5>
          <div className="row g-3 align-items-center">
            <div className="col-12 col-sm-7">
              <DateRangePicker block onChange={value => this.getCurrentDateRecord(value)} format="dd/MM/yyyy"/>
            </div>
            <div className="col-12 col-sm-5">
              <select id='report_timeperiod_type' className="form-select w-100" >
                <option value="Weekly">Weekly Report</option>
                <option value="Daily">Daily Report</option>
                <option value="Monthly">Monthly Report</option>
              </select>
            </div>
          </div>
        </div>
        <div id='log'></div>
        <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', maxWidth: '750px' }}>
          <div className="card-header bg-transparent border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <i className="fas fa-table me-2 text-primary"></i><span className="fw-semibold">Progress Metrics</span>
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

    )
  }
}

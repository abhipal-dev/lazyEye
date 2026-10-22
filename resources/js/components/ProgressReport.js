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
    this.state = {
      data: {},
    }
  }

  componentDidMount() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    this.getCurrentDateRecord([start, end]);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      this.getCurrentDateRecord([start, end]);
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
  parseRecordsData = () => {
    let data = {};
    if (this.props.data) {
      try {
        data = typeof this.props.data === 'string' ? JSON.parse(this.props.data) : this.props.data;
      } catch (e) {
        console.error("Error parsing progress report data:", e);
        data = {};
      }
    }
    return data || {};
  }

  printReport = (data) => {
    const $tbody = $('#datatablesSimple tbody');
    $tbody.empty();
    $('#report-summary-cards').empty();

    let dates = Object.keys(data || {});
    let totalSessionsFound = 0;
    let totalScoreSum = 0;
    let scoreCount = 0;
    let gameFrequency = {};

    dates.forEach(d => {
      const dayGames = data[d] || {};
      const gameKeys = Object.keys(dayGames);
      if (gameKeys.length > 0) {
        totalSessionsFound++;
        gameKeys.forEach(g => {
          const s = +dayGames[g];
          if (!isNaN(s) && s > 0) {
            totalScoreSum += s;
            scoreCount++;
            gameFrequency[g] = (gameFrequency[g] || 0) + 1;
          }
        });
      }
    });

    if (totalSessionsFound === 0) {
      $tbody.append(`
        <tr>
          <td colspan="3" class="text-center py-5 text-muted">
            <i class="fa-solid fa-file-circle-question fa-3x mb-3 text-secondary opacity-50 d-block"></i>
            <h5 class="fw-semibold text-main mb-1">No Therapy Records in Selected Period</h5>
            <small class="text-sub">Select another date range or launch a therapy game to generate progress metrics.</small>
          </td>
        </tr>
      `);
      return;
    }

    // Determine top game
    let topGame = 'N/A';
    let topCount = 0;
    Object.keys(gameFrequency).forEach(g => {
      if (gameFrequency[g] > topCount) {
        topCount = gameFrequency[g];
        topGame = g;
      }
    });

    const avgScore = scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 0;

    // Render summary KPI cards
    $('#report-summary-cards').html(`
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <div class="text-sub small font-mono text-uppercase">Active Periods</div>
            <div class="h3 fw-bold text-main mb-0 font-mono">${totalSessionsFound}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <div class="text-sub small font-mono text-uppercase">Total Games</div>
            <div class="h3 fw-bold text-main mb-0 font-mono">${scoreCount}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <div class="text-sub small font-mono text-uppercase">Avg Score</div>
            <div class="h3 fw-bold text-main mb-0 font-mono">${avgScore} <small class="fs-6 fw-normal text-muted">pts</small></div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <div class="text-sub small font-mono text-uppercase">Top Modality</div>
            <div class="h4 fw-bold text-main mb-0 text-truncate font-mono">${topGame}</div>
          </div>
        </div>
      </div>
    `);

    for (let i = 0; i < dates.length; i++) {
      let game_data = Object.keys(data[dates[i]] || {});
      if (!game_data.length) continue; // Skip empty periods

      $tbody.append(`
        <tr style="background-color: var(--bg-surface-secondary);">
          <td colspan="3" class="py-2 px-3 fw-bold text-main font-mono small border-bottom" style="border-color: var(--border-color);">
            <i class="fa-solid fa-calendar-check text-primary me-2"></i>Period: ${dates[i]}
          </td>
        </tr>
      `);
      for (let j = 0; j < game_data.length; j++) {
        let game_icon = this.findGameIconAddress(game_data[j]);
        let score = Math.round(+data[dates[i]][game_data[j]]);
        $tbody.append(`
          <tr>
            <td style="width: 60px;">
              <img src="${game_icon}" style="width: 2.2rem; height: 2.2rem; object-fit: contain;">
            </td>
            <td>
              <strong class="text-main">${game_data[j]}</strong>
              <small class="d-block text-muted">Dichoptic Amblyopia Therapy</small>
            </td>
            <td class="text-end">
              <span class="badge border font-mono px-3 py-1 fw-bold" style="background-color: var(--bg-surface-secondary); border-color: var(--border-color); color: var(--text-main); font-size: 0.88rem;">${score} pts</span>
            </td>
          </tr>
        `);
      }
    }
  }

  daily_report = (temp_date) => {
    let data = this.parseRecordsData();
    let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
    let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format)) + 86399999;
    let dates = Object.keys(data);
    let start_temp_timestamp = startDate;
    let daily_data = {};
    let start_temp_date = '';
    while (start_temp_timestamp <= endDate) {
      start_temp_date = this.getDateFromTimestamp(start_temp_timestamp);
      daily_data[`${start_temp_date}`] = {};
      for (let i = 0; i < dates.length; i++) {
        const ts = +dates[i];
        if (this.getDateFromTimestamp(ts) === this.getDateFromTimestamp(start_temp_timestamp)) {
          let game_played_data = Object.keys(data[dates[i]]);
          for (let j = 0; j < game_played_data.length; j++) {
            let score = +data[dates[i]][game_played_data[j]];
            if (score !== undefined && score !== null && !isNaN(score)) {
              if (daily_data[`${start_temp_date}`].hasOwnProperty(game_played_data[j])) {
                daily_data[`${start_temp_date}`][game_played_data[j]] = (score + (+daily_data[`${start_temp_date}`][game_played_data[j]])) / 2;
              } else {
                daily_data[`${start_temp_date}`][game_played_data[j]] = score;
              }
            }
          }
        }
      }
      start_temp_timestamp = start_temp_timestamp + 24 * 60 * 60 * 1000;
    }

    $('div#log').html(`
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 mt-4">
        <h4 class="fw-bold text-main mb-0">Daily Clinical Progress: ${this.getDateFromTimestamp(startDate)} &ndash; ${this.getDateFromTimestamp(endDate)}</h4>
        <span class="badge border font-mono px-3 py-1" style="background-color: var(--bg-surface-secondary); color: var(--text-main);">Daily Resolution</span>
      </div>
    `);
    this.printReport(daily_data);
  }

  weekly_report = (temp_date) => {
    let data = this.parseRecordsData();
    let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
    let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format)) + 86399999;
    let dates = Object.keys(data);
    let start_temp_timestamp = startDate;
    let end_temp_timestamp = start_temp_timestamp + 6 * 24 * 60 * 60 * 1000;
    let weekly_data = {};
    let start_temp_date = '';
    let end_temp_date = '';

    while (start_temp_timestamp <= endDate) {
      let current_end_timestamp = Math.min(start_temp_timestamp + (7 * 86400000) - 1, endDate);
      start_temp_date = this.getDateFromTimestamp(start_temp_timestamp);
      end_temp_date = this.getDateFromTimestamp(current_end_timestamp);
      const weekKey = `${start_temp_date} &ndash; ${end_temp_date}`;
      weekly_data[weekKey] = {};

      for (let i = 0; i < dates.length; i++) {
        const ts = +dates[i];
        if (ts >= start_temp_timestamp && ts <= current_end_timestamp) {
          let game_played_data = Object.keys(data[dates[i]]);
          for (let j = 0; j < game_played_data.length; j++) {
            let score = +data[dates[i]][game_played_data[j]];
            if (score !== undefined && score !== null && !isNaN(score)) {
              if (weekly_data[weekKey].hasOwnProperty(game_played_data[j])) {
                weekly_data[weekKey][game_played_data[j]] = (score + (+weekly_data[weekKey][game_played_data[j]])) / 2;
              } else {
                weekly_data[weekKey][game_played_data[j]] = score;
              }
            }
          }
        }
      }
      start_temp_timestamp = current_end_timestamp + 1;
    }

    $('div#log').html(`
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 mt-4">
        <h4 class="fw-bold text-main mb-0">Weekly Rollup: ${this.getDateFromTimestamp(startDate)} &ndash; ${this.getDateFromTimestamp(endDate)}</h4>
        <span class="badge border font-mono px-3 py-1" style="background-color: var(--bg-surface-secondary); color: var(--text-main);">7-Day Cohort</span>
      </div>
    `);
    this.printReport(weekly_data);
  }

  monthly_report = (temp_date) => {
    let data = this.parseRecordsData();
    let startDate = this.getTimestamp(moment(temp_date[0]).format(this.props.date_format));
    let endDate = this.getTimestamp(moment(temp_date[1]).format(this.props.date_format)) + 86399999;
    let dates = Object.keys(data);
    let start_temp_timestamp = startDate;
    let end_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(start_temp_timestamp), this.props.date_format).add(1, 'months'));
    let monthly_data = {};
    let start_temp_date = '';
    let end_temp_date = '';

    while (start_temp_timestamp < endDate) {
      if (end_temp_timestamp > endDate) {
        end_temp_timestamp = endDate;
      }
      start_temp_date = this.getDateFromTimestamp(start_temp_timestamp);
      end_temp_date = this.getDateFromTimestamp(end_temp_timestamp);
      const monthKey = `${start_temp_date} &ndash; ${end_temp_date}`;
      monthly_data[monthKey] = {};

      for (let i = 0; i < dates.length; i++) {
        const ts = +dates[i];
        if (ts >= start_temp_timestamp && ts <= end_temp_timestamp) {
          let game_played_data = Object.keys(data[dates[i]]);
          for (let j = 0; j < game_played_data.length; j++) {
            let score = +data[dates[i]][game_played_data[j]];
            if (score !== undefined && score !== null && !isNaN(score)) {
              if (monthly_data[monthKey].hasOwnProperty(game_played_data[j])) {
                monthly_data[monthKey][game_played_data[j]] = (score + (+monthly_data[monthKey][game_played_data[j]])) / 2;
              } else {
                monthly_data[monthKey][game_played_data[j]] = score;
              }
            }
          }
        }
      }
      start_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(end_temp_timestamp), this.props.date_format).add(1, 'days'));
      end_temp_timestamp = this.getTimestamp(moment(this.getDateFromTimestamp(start_temp_timestamp), this.props.date_format).add(1, 'months'));
    }

    $('div#log').html(`
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 mt-4">
        <h4 class="fw-bold text-main mb-0">Monthly Rollup: ${this.getDateFromTimestamp(startDate)} &ndash; ${this.getDateFromTimestamp(endDate)}</h4>
        <span class="badge border font-mono px-3 py-1" style="background-color: var(--bg-surface-secondary); color: var(--text-main);">Monthly Cohort</span>
      </div>
    `);
    this.printReport(monthly_data);
  }

  getCurrentDateRecord = (temp_date) => {
    if (!temp_date || !temp_date[0] || !temp_date[1]) return;
    this.currentDateRange = temp_date;
    let report_timeperiod_type = $('select#report_timeperiod_type').val() || 'Weekly';
    if (report_timeperiod_type === 'Daily') {
      this.daily_report(temp_date);
    } else if (report_timeperiod_type === 'Monthly') {
      this.monthly_report(temp_date);
    } else {
      this.weekly_report(temp_date);
    }
  }

  render() {
    return (
      <div className="py-2">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h3 className="fw-bold mb-1 text-main d-flex align-items-center gap-2">
              <i className="fa-solid fa-chart-line text-primary"></i>
              Visual Therapy Progress Report
            </h3>
            <p className="text-muted small mb-0">
              Aggregated binocular performance, session frequencies, and score trajectories.
            </p>
          </div>
        </div>

        {/* Filter Card */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '850px' }}>
          <h6 className="fw-bold mb-3 text-main"><i className="fa-solid fa-sliders text-primary me-2"></i>Filter Date & Period Resolution</h6>
          <div className="row g-3 align-items-center">
            <div className="col-12 col-sm-7">
              <DateRangePicker 
                block 
                onChange={value => this.getCurrentDateRecord(value)} 
                format="dd/MM/yyyy"
                placeholder="Select date range"
              />
            </div>
            <div className="col-12 col-sm-5">
              <select 
                id='report_timeperiod_type' 
                className="form-select w-100"
                onChange={() => {
                  if (this.currentDateRange) {
                    this.getCurrentDateRecord(this.currentDateRange);
                  }
                }}
              >
                <option value="Weekly">Weekly Rollup</option>
                <option value="Daily">Daily Breakdown</option>
                <option value="Monthly">Monthly Rollup</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Summary Cards Target */}
        <div id="report-summary-cards" style={{ maxWidth: '850px' }}></div>

        {/* Log Title Target */}
        <div id='log' style={{ maxWidth: '850px' }}></div>

        {/* Progress Metrics Table */}
        <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '850px' }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3" style={{ borderColor: 'var(--border-color)' }}>
            <span className="fw-semibold text-main"><i className="fas fa-table me-2 text-primary"></i>Prescribed Therapy Sessions</span>
            <span className="badge border font-mono small" style={{ backgroundColor: 'var(--bg-surface-secondary)', color: 'var(--text-sub)' }}>Normalized Audit</span>
          </div>
          <div className="card-body table-responsive p-0">
            <table id="datatablesSimple" className='table table-hover mb-0 align-middle' >
              <thead>
                <tr className="border-bottom" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface-secondary)', fontSize: '0.8rem' }}>
                  <th style={{ width: '60px' }} className="py-2 px-3 text-sub font-mono text-uppercase">Game</th>
                  <th className="py-2 text-sub font-mono text-uppercase">Exercise Title</th>
                  <th className="py-2 px-3 text-end text-sub font-mono text-uppercase">Clinical Score</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

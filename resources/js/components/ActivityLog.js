import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import moment from "moment";

export default class ActivityLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      selectedRecords: {}
    };
  }

  findGameIconAddress = (game_name) => {
    if (game_name === 'Snake') return '/images/Snake-icon-1.png';
    if (game_name === 'Flappy Bird') return '/images/Flappy-Square.png';
    if (game_name === 'Sticky Holds') return '/images/Sticky-Holds.png';
    if (game_name === 'Menja') return '/images/Menja-icon.png';
    if (game_name === 'Tetris') return '/images/Tetris.png';
    if (game_name === 'Bubble Shooter') return '/images/Bubble.png';
    if (game_name === 'Ping Pong') return '/images/Ping-Pong.png';
    if (game_name === 'Maze') return '/images/Maze.png';
    if (game_name === 'Ball Catcher') return '/images/ballcatcher.jpeg';
    if (game_name === 'Bouncing Ball') return '/images/bouncing-ball.png';
    return '/images/lazyeye-icon.svg';
  };

  convert = (dateObj) => {
    if (!dateObj) return '';
    return moment(dateObj).format('DD/MM/YYYY');
  };

  shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };

  parseRecordsObject = () => {
    const raw = this.props.data;
    let gameRecords = {};
    if (raw) {
      try {
        gameRecords = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (e) {
        console.error('Failed to parse game records in ActivityLog', e);
      }
    }

    const formattedMap = {};
    Object.keys(gameRecords).forEach(key => {
      const dateFormatted = moment(+key).format('DD/MM/YYYY');
      if (!formattedMap[dateFormatted]) {
        formattedMap[dateFormatted] = {};
      }
      Object.assign(formattedMap[dateFormatted], gameRecords[key]);
    });
    return formattedMap;
  };

  handleCellClick = (value, formattedMap) => {
    if (!value || !value.date) return;
    const dateFormatted = this.convert(value.date);
    const recordsForDay = formattedMap[dateFormatted] || {};
    this.setState({
      selectedDate: dateFormatted,
      selectedRecords: recordsForDay
    });
  };

  render() {
    const today = new Date();
    const formattedMap = this.parseRecordsObject();
    const activeDates = Object.keys(formattedMap);

    // If no date selected yet, default to most recent activity date if present
    const currentSelectedDate = this.state.selectedDate || (activeDates.length > 0 ? activeDates[activeDates.length - 1] : moment().format('DD/MM/YYYY'));
    const currentRecords = this.state.selectedDate ? this.state.selectedRecords : (formattedMap[currentSelectedDate] || {});
    const sessionKeys = Object.keys(currentRecords);

    const heatmapValues = Array.from({ length: 180 }, (_, i) => {
      const date = this.shiftDate(today, -i);
      const dateStr = this.convert(date);
      const dayData = formattedMap[dateStr];
      return {
        date: date,
        count: dayData ? Object.keys(dayData).length : 0
      };
    });

    return (
      <div className="py-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1 text-main">
              <i className="fa-solid fa-calendar-check text-primary me-2"></i>Therapy Activity Log & Heatmap
            </h2>
            <p className="text-sub mb-0 small">Daily visual therapy engagement and dichoptic game history</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge border font-mono small px-3 py-2 rounded-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
              <i className="fa-solid fa-circle-info me-1"></i> Click any colored square to inspect that day's session scores
            </span>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1 text-main">
                <i className="fa-solid fa-fire text-danger me-2"></i>Consecutive Therapy Heatmap (Last 180 Days)
              </h5>
              <small className="text-sub">Tracking dichoptic suppression therapy compliance over time</small>
            </div>
            <div className="d-flex align-items-center gap-1 text-sub small font-mono">
              <span>Less</span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: 'var(--border-color, #e2e8f0)' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#a7f3d0' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#34d399' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#10b981' }}></span>
              <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#059669' }}></span>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-auto pb-2" style={{ minHeight: '140px' }}>
            <CalendarHeatmap
              startDate={this.shiftDate(today, -180)}
              endDate={today}
              values={heatmapValues}
              classForValue={value => {
                if (!value || value.count === 0) return 'color-empty';
                if (value.count === 1) return 'color-github-1';
                if (value.count === 2) return 'color-github-2';
                if (value.count === 3) return 'color-github-3';
                return 'color-github-4';
              }}
              tooltipDataAttrs={value => {
                return {
                  'data-tooltip-id': `activity-tooltip`,
                  'data-tooltip-content': `${this.convert(value.date)}: ${value.count} activity session(s)`,
                  'data-tooltip-place': 'top',
                };
              }}
              showWeekdayLabels={true}
              onClick={value => this.handleCellClick(value, formattedMap)}
            />
          </div>
        </div>

        <ReactTooltip id="activity-tooltip" />

        {/* Selected Day Details Table */}
        <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3 flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-list-check text-main"></i>
              <span className="fw-semibold text-main">Session Records for: </span>
              <span className="badge font-mono small px-3 py-1 rounded-2" style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}>{currentSelectedDate}</span>
            </div>
            {activeDates.length > 0 && (
              <span className="small text-muted font-mono">{sessionKeys.length} game(s) recorded on this date</span>
            )}
          </div>
          <div className="card-body table-responsive p-0">
            {sessionKeys.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="fa-solid fa-gamepad fa-2x mb-2 text-secondary opacity-50 d-block"></i>
                <div className="fw-semibold text-main">No therapy games recorded on {currentSelectedDate}</div>
                <small className="text-sub">Select any colored square on the calendar heatmap above to inspect your session scores.</small>
              </div>
            ) : (
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>Game Icon</th>
                    <th>Prescribed Game Title</th>
                    <th>Score / Vision Performance</th>
                    <th>Therapy Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionKeys.map((gameName, idx) => {
                    const icon = this.findGameIconAddress(gameName);
                    const score = currentRecords[gameName];
                    return (
                      <tr key={idx}>
                        <td>
                          <img src={icon} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        </td>
                        <td>
                          <strong className="text-main">{gameName}</strong>
                          <small className="d-block text-muted">Binocular Suppression Therapy</small>
                        </td>
                        <td>
                          <span className="badge border font-mono small px-3 py-1 fw-bold" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                            {score} pts
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success font-mono">
                            <i className="fa-solid fa-circle-check me-1"></i>Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

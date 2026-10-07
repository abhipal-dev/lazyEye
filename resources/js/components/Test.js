import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css'
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import moment from "moment";
import Table from './Table';

export default class Test extends React.Component {
 
  render() {
    const today = new Date();
    const str = '{"1676313000000":{"Snake":34,"Menja":0},"1676485800000":{"Ping Pong":"82","Tetris":34,"Bubble Shooter":26,"Sticky Holds":26,"Bouncing Ball":123,"Flappy Bird":34},"1676745000000":{"Snake":78},"1677090600000":{"Snake":12,"Menja":0},"1677177000000":{"Ping Pong":"82","Tetris":67,"Bubble Shooter":55,"Sticky Holds":55,"Bouncing Ball":123,"Flappy Bird":87},"1679682600000":{"Snake":50},"1677436200000":{"Snake":30,"Menja":0},"1677522600000":{"Ping Pong":"82","Tetris":56,"Bubble Shooter":12,"Sticky Holds":55,"Bouncing Ball":123,"Flappy Bird":34},"1677781800000":{"Snake":49},"1677868200000":{"Snake":90,"Menja":0},"1678041000000":{"Ping Pong":"82","Tetris":0,"Bubble Shooter":23,"Sticky Holds":55,"Bouncing Ball":123,"Flappy Bird":56},"1678127400000":{"Snake":89},"1678300200000":{"Snake":12,"Menja":0},"1678386600000":{"Ping Pong":"82","Tetris":33,"Bubble Shooter":20,"Sticky Holds":55,"Bouncing Ball":123,"Flappy Bird":23},"1678559400000":{"Snake":65},"1678645800000":{"Snake":34,"Menja":0},"1678732200000":{"Ping Pong":"82","Tetris":80,"Bubble Shooter":89,"Sticky Holds":55,"Bouncing Ball":123,"Flappy Bird":78},"1678818600000":{"Snake":60},"1678905000000":{"Ping Pong":"82","Tetris":60,"Bubble Shooter":45,"Sticky Holds":26,"Bouncing Ball":123,"Flappy Bird":56},"1679164200000":{"Snake":70},"1679509800000":{"Snake":12,"Menja":0},"1679596200000":{"Ping Pong":"82","Tetris":30,"Bubble Shooter":26,"Sticky Holds":26,"Bouncing Ball":123,"Flappy Bird":22},"1679855400000":{"Snake":12,"Menja":0},"1679941800000":{"Ping Pong":"82","Tetris":10,"Bubble Shooter":67,"Sticky Holds":26,"Bouncing Ball":123,"Flappy Bird":33},"1680028200000":{"Snake":10}}'
    console.log(str)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    var game_records_object = JSON.parse(str)
    // const user_active_dates = Object.keys(game_records_object) //in Timestamp
    const formatted_date_records_object={}
    $.each(game_records_object, function (key, value) {
      formatted_date_records_object[moment(+key).format("DD/MM/YYYY")] = value;
    })
    user_active_dates.forEach(function(part, index, theArray) {
      // user_active_dates[index] = moment(+theArray[index]).format("DD/MM/YYYY");  //in formatted date DD/MM/YYYY
  });
  
    const randomValues = getRange(200).map(index => {
      if(formatted_date_records_object.hasOwnProperty(convert(shiftDate(today,-index)))){
        return {
          date: shiftDate(today, -index),
          count:  Object.keys(formatted_date_records_object[convert(shiftDate(today, -index))]).length                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        };
      }else{
        return {    
          date: shiftDate(today, -index),
          count: 0,
        };
      } 
    });

    function convert(str2){
      console.log("randomValues")
      console.log(randomValues)
      console.log("str2")
      console.log(str2)
      console.log("user_active_dates")
      console.log(user_active_dates)
      console.log("test")
      console.log(test)
  
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
      return [date[2], mnths[date[1]],date[3]].join("/");
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
    function getCurrentDateRecord(temp_date) {
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
                                  <th>Game Played</th>
                                   <th>Score</th>
                             </tr>
          `)
        let table_data = ``
        $.each(formatted_date_records_object[formatDate], function (key, value) {
          table_data += `<tr>
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
      'data-tooltip-content': `${convert(value.date)} ${value.timestamp} has ${value.count} activities`,
      'data-tooltip-place': "top",
    };
  }}
  showWeekdayLabels={true}
  onClick={value => getCurrentDateRecord(value.date)}
/>
<ReactTooltip id="my-tooltip" />
          <div id='log'></div>
          <div className="card mb-4">
            <div className="card-header" >
              <i className="fas fa-table me-1"></i><span></span>
            </div>
            <div className="card-body table-responsive" style={{ 'max-width': "600px" }}>
              <table id="datatablesSimple" className='table table-hover table-striped' >
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

if (document.getElementById('test')) {
  ReactDOM.render(<Test />, document.getElementById('test'))
}




<template>
    <div class="datepicker">
      <input type="text" v-model="selectedDate" @focus="showCalendar" readonly />
      <div v-show="calendarVisible" class="calendar">
        <table>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, index) in calendar" :key="index">
              <td v-for="day in week" :key="day.date" @click="selectDate(day)">
                {{ day.date }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedDate: "",
        calendarVisible: false,
        calendar: [],
      };
    },
    methods: {
      showCalendar() {
        this.calendarVisible = true;
        this.generateCalendar();
      },
      hideCalendar() {
        this.calendarVisible = false;
      },
      generateCalendar() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
  
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
  
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();
  
        let dayCounter = 1;
        let calendar = [];
  
        for (let i = 0; i < 6; i++) {
          let week = [];
          for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
              week.push({ date: "" });
            } else if (dayCounter <= daysInMonth) {
              week.push({ date: dayCounter });
              dayCounter++;
            } else {
              week.push({ date: "" });
            }
          }
          calendar.push(week);
        }
  
        this.calendar = calendar;
      },
      selectDate(day) {
        if (day.date !== "") {
          this.selectedDate = `${day.date}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
          this.hideCalendar();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .datepicker {
    position: relative;
    display: inline-block;
  }
  
  input {
    padding: 10px;
  }
  
  .calendar {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .calendar table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .calendar th, .calendar td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .calendar th {
    background-color: #f2f2f2;
  }
  
  .calendar td:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }
  </style>
  
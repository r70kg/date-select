import {Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {AppCacheService} from 'src/app/core/services/app-cache/app-cache.service';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.css']
})
export class DateSelectComponent implements OnInit, OnChanges {
  // this.years$ = this.appCacheService.entryYears;

  // 默认年份
  @Input() years$: Observable<any> = this.appCacheService.entryYears;


  @Input() public dateSelect = {startTime: null, endTime: null};
  @Output() dateSelectChange = new EventEmitter();


  constructor(
    private appCacheService: AppCacheService
  ) {
  }

  public year = null;
  public quarter = null;
  public month = null;


  qrList = [
    {
      value: 1,
      text: '一'
    }
  ]; // 季度数组
  monthList = [
    {
      value: 1,
      text: '1'
    }
  ]; // 月数组


  quarters = [
    {
      value: 1,
      text: '第一季度'
    },
    {
      value: 2,
      text: '第二季度'
    },
    {
      value: 3,
      text: '第三季度'
    },
    {
      value: 4,
      text: '第四季度'
    }
  ];
  months = [
    [
      {
        value: 1,
        text: '1月'
      }, {
      value: 2,
      text: '2月'
    }, {
      value: 3,
      text: '3月'
    }

    ],
    [
      {
        value: 4,
        text: '4月'
      },
      {
        value: 5,
        text: '5月'
      },
      {
        value: 6,
        text: '6月'
      },
    ],

    [
      {
        value: 7,
        text: '7月'
      },
      {
        value: 8,
        text: '8月'
      },
      {
        value: 9,
        text: '9月'
      }
    ],
    [
      {
        value: 10,
        text: '10月'
      },
      {
        value: 11,
        text: '11月'
      },
      {
        value: 12,
        text: '12月'
      }
    ]
  ];


  ngOnInit(): void {
    this.getYears();

    // this.addCity();
    this.setDate(
      this.dateSelect
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    let {
      dateSelect: {currentValue}
    } = changes;

    this.setDate(
      currentValue
    );
  }

  // 获取年度
  getYears(): void {

  }


  addQuarter(value = this.year): void {


    this.year = value;
    // 每次联动前，将联动下拉框清空；
    this.monthList = [];
    this.qrList = [];
    this.quarter = null;
    this.month = null;

    /**
     * 根据value循环quarters数组，将对应城市一一添加进城市下拉框。
     * 年度必填
     */
    if (value !== null) {
      this.qrList = this.quarters;
    }


    this.getDate();
  }


  // 月分
  addMonth(value = this.quarter): void {
    this.quarter = value;
    this.monthList = [];
    this.month = null;


    if (value !== null) {
      value--;
      // 同上
      for (var i = 0; i < this.months[value].length; i++) {
        this.addMonthOpt(this.months[value][i].text, this.months[value][i].value);
      }
    }
    this.getDate();
  }

  addMonthOpt(text, value): void {
    this.monthList.push({
      text,
      value
    });
  }


  monthChange(value): void {
    this.month = value;
    this.getDate();
  }

  /**
   * 设置日期
   * @param x 年
   * @param y 季度
   * @param z 月
   */
  setDate(val = {startTime: null, endTime: null}): void {
    let x, y, z;


    let {startTime, endTime} = val;


    if (startTime && endTime) {
      let _arrStart = startTime.split('/').map((item, idex) => {
        return parseInt(item);
      });
      let _arrEnd = endTime.split('/').map((item, idex) => {
        return parseInt(item);
      });

      let _startMonth = _arrStart[1];
      let _endMonth = _arrEnd[1];

      x = _arrStart[0];

      if (_startMonth === 1 && _endMonth === 12) {
        y = null;
        z = null;
      } else if (_startMonth === 1) {
        y = 1;
      } else if (_startMonth === 4) {
        y = 2;
      } else if (_startMonth === 7) {
        y = 3;
      } else {
        y = 4;
      }

      if (_startMonth === _endMonth && _startMonth && _endMonth) {
        z = _startMonth;
        if (1 <= _startMonth && _startMonth <= 3) {
          y = 1;
        } else if (4 <= _startMonth && _startMonth <= 6) {
          y = 2;
        } else if (7 <= _startMonth && _startMonth <= 9) {
          y = 3;
        } else {
          y = 4;
        }
      }
    } else {
      x = y = z = null;
    }
    this.year = x;
    this.addQuarter(x);
    this.quarter = y;
    this.addMonth(y);
    this.month = z;
  }

  /**
   * 取值
   * @param a 年
   * @param b 季度
   * @param c 月
   */
  getDate(a = this.year, b = this.quarter, c = this.month): void {
    // 年月日
    let _y = null;
    let _m = null;
    let _d = null;
    let _start = '';
    let _end = '';

    // 0 请选择
    if (a === null) {
      _start = '';
      _end = '';
    } else {
      // 年度有值 直接获取年
      _y = a;
      _start = `${_y}/1/1`;
      _end = `${_y}/12/31`;

      // 若 b（季度）有值

      if (b !== null) {
        // 若选择了月份,直接取 年和月
        if (c > 0) {
          _m = c;

          _start = `${_y}/${_m}/1`;
          // let arrMonth = [1,3,5,7,8,10,12];


          switch (_m) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
              _end = `${_y}/${_m}/31`;
              break;
            case 2:   // 2月 区分闰年和平台
              if (this.isLeap(_y)) {
                _end = `${_y}/${_m}/29`;
              } else {
                _end = `${_y}/${_m}/28`;
              }
              break;
            default:
              _end = `${_y}/${_m}/30`;

          }
        } else {
          // 选择了季度,没选择月份
          switch (b) {
            case 1:
              _start = `${_y}/1/1`;
              _end = `${_y}/3/31`;
              break;
            case 2:
              _start = `${_y}/4/1`;
              _end = `${_y}/6/30`;
              break;
            case 3:
              _start = `${_y}/7/1`;
              _end = `${_y}/9/30`;
              break;
            case 4:
              _start = `${_y}/10/1`;
              _end = `${_y}/12/31`;
          }
        }
      }
    }


    this.dateSelect = {
      startTime: _start,
      endTime: _end
    };
    // 对外暴露
    this.dateSelectChange.emit(this.dateSelect);
  }

  // 闰年区分
  isLeap(year): any {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

}

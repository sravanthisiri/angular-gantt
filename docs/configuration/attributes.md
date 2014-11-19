# Attributes

`gantt` directive can be configured using attributes. Each attribute is interpreted as 
[AngularJS Expression](https://docs.angularjs.org/guide/expression).

- ### api

    Registers an API Object to call methods of the component and listen or raise events.
  
    See [API](#api) for more details.
    
        <gantt api="registerApi"></gantt>
    
    <!-- -->
        
        $scope.registerApi = function(api) {
          api.core.on.ready() {
            // Call API methods and register events.
          }
        }

- ### auto-expand

    Define if the date range will be extended when the user scroll to the left or right edge.
    
    - `both`
    - `left`
    - `right`
    - `none`

- ### allow-labels-resizing

    Row label section can be resized.
    
    default: `true`

- ### current-date

    How current date is displayed.
    
    - `none`
    - `line`
    - `column`
    
    default: `line`

- ### current-date-value

    Current date in the chart.
    
        <gantt current-date="getToday"></gantt>
      
    <!-- -->
      
        $scope.getToday = new Date();
    
    default: `new Date()`

- ### column-width

    The width of each column in `px`. This allows you add logic like `column-width="viewScale == 'day' ?  50 : 20"` to 
    have wider columns for days than for other column scales.
    
    If `undefined`, gantt will adjust columns width to fill available space.

- ### column-magnet

    Precision of the column. All date and time computation will be rounded using this precision.
    
    Format is `<integer> <momentjs-unit>`. See [momentJS#add()](http://momentjs.com/docs/#/manipulating/add/) for 
    a list of supported unit.
    
    Examples:
    
    - `1 minute`
    - `30 minutes`
    - `1 hour`
    - `3 hours`
    
    default: `15 minutes`

- ### data

    The [data](data.md) model for the gantt chart. 
      
    See [Data](data.md) for more information.

- ### filter-task, filter-task-comparator

    Expression to filter on visible tasks using angularJS `$filter('filter')`.
    
    Value of `filter-task` is `expression` (`string`|`Object`|`function(value, index)`)),
    and `filter-task-comparator` is `comparator` (`function(actual, expected)`|`boolean`|`undefined`)
    as defined in [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter).
  
    When using a function, call [api.rows.refresh()](#api-rows-refresh) to refresh filtering when required.

- ### filter-row, filter-row-comparator

    Expression to filter on visible rows using angularJS `$filter('filter')`.
    
    Value of `filter-row` is `expression` (`string`|`Object`|`function(value, index)`)), 
    and `filter-row-comparator` is `comparator` (`function(actual, expected)`|`boolean`|`undefined`)
    as defined in  [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter)).
  
    When using a function, call [api.rows.refresh()](#api-rows-refresh) to refresh filtering when required.

- ### from-date

    Ensures that the chart rendering starts at this date. This is useful for showing the chart even without any tasks, or 
    empty time before the first task, or truncate previous tasks.

- ### to-date

    Ensures that the chart rendering goes at least to this date. This is useful for showing the chart even without any 
    tasks, or empty time after the last task, or truncate next tasks.

- ### headers

    Array of headers to display.
  
      - `second`
      - `minute`
      - `hour`
      - `day`
      - `week`
      - `month`
      - `quarter`
      - `year`
      
    <!-- -->
    
        <gantt headers="['month', 'week', 'day']"></gantt>

- ### headers-formats

    Associative object of headers format. Key is the header, and value is the format.
    
    See [momentJS#format()](http://momentjs.com/docs/#/displaying/format/)
    
        <gantt headers-formats="headersFormats"></gantt>
      
    <!-- -->
    
        $scope.headersFormats = { 
          'year': 'YYYY', 
          'quarter': '[Q]Q YYYY', 
          month: 'MMMM YYYY', 
          week: 'w', 
          day: 'D', 
          hour: 'H', 
          minute:'HH:mm'
        };


- ### labels-width
  
    Width of label section on the left side of the Gantt. This property support two way binding. Therefore if the user
    resizes the label section any assigned scope variable will be updated too.

- ### show-labels-column

    Whether the column with labels is to be shown or not. This attribute support two way binding, hence the visibility
    of the column may be toggled.
    
    default: `true`
  
- ### time-frames, date-frames

    TimeFrames and DateFrames are used to configure global calendar in the gantt.
  
    A TimeFrame is a part of day, for example 8H00-20H00 or 12H00-13H30. Each TimeFrame can be marked as working or not.
    A TimeFrame can also be marked as default to be used for every day displayed in the gantt.
    
    A DateFrame is a configuration object that will reference one or many TimeFrame names for specific days in the
    calendar. Using DateFrame configurations, it's possible to setup holidays, weekends and other special days that will
    have different time schedules than usual.
    
        <gantt time-frames="timeFrames" date-frames="dateFrames"></gantt>

    <!-- -->
  
        $scope.timeFrames = {
                            day: {
                                start: moment('8:00', 'HH:mm'),
                                    end: moment('20:00', 'HH:mm'),
                                    working: true, // This is a working period
                                    default: true // It will be used for each day
                                },
                            noon: {
                                start: moment('12:00', 'HH:mm'),
                                end: moment('13:30', 'HH:mm'),
                                working: false, // This is a resting period
                                default: true // It will be used for each day
                            },
                            closed: {
                                working: false // We don't work when it's closed
                            }
        };
        
        $scope.dateFrames = {
                            halloween:{
                                date: moment('2014-10-31', 'YYYY-MM-DD'), // A specific date
                                targets: ['day'] // Use timeFrame named day for halloween. We won't close for noon.
                            },
                            holidays: {
                                 start: moment('2014-08-15', 'YYYY-MM-DD'), // A date range
                                 end: moment('2014-08-30', 'YYYY-MM-DD'),
                                 targets: ['closed'] // use timeFrame named closed for this date range.
                            }, 
                            weekend: {
                                 evaluator: function(date) { // A custom function evaluated for each day in the gantt
                                     return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                                 },
                                 targets: ['closed'] // Use timeFrame named closed for saturday and sunday.
                            }
        };
  
    In this example, three TimeFrames (`day`, `noon`, `closed`) and three DateFrames (`halloween`, `holidays`, `weekend`) 
    are defined.
    
    If a day match at least one DateFrame, it will apply TimeFrames defined in `targets` property of each matching
    DateFrame. If no DateFrame at all match the day, it will use `default` TimeFrames (`day` and `noon`).
    
    When multiple TimeFrames are found for a day, smaller ones have priority and bigger ones will be split or shrinked.
    
    After resolution of TimeFrame for each day, TimeFrame can be displayed or cropped from the gantt using
    `time-frames-working-mode` and `time-frames-non-working-mode`.
    
    You can also add `color` and `classes` properties on TimeFrame object to define custom style on displayed timeFrames.
    
        closed: {
             working: false // We don't work when it's closed
             color: 'green' // Display in green because green is a nice color :)
             classes: ['gantt-closed-timeframe'] // Give one or many class names to customize using CSS.       
         }

- ### time-frames-working-mode

    How working TimeFrames are displayed.
    
    - `visible`
    - `hidden`
    - `cropped`
        
     default: `hidden`

- ### time-frames-non-working-mode

    How non-working TimeFrames are displayed.
      
    - `visible`
    - `hidden`
    - `cropped`
        
    default: `visible`

- ### timespans

    The [timespans](timespans.md) model for the gantt chart. 
      
    See [Timespans](timespans.md) for more information.

- ### max-height

    Maximum height of the Gantt. It will show a vertical scroll bar if the content does not fit inside.
  
- ### options
  
    Configure the gantt using as a plain old javascript object, keys of `options` representing the configuration
    attributes. camelCased version of attributes must be used as key (`autoExpand` instead of `auto-expand`).
  
        <gantt options="options"></gantt>
    
    <!-- -->
  
        $scope.options = {
          data: [...],
          api: function(api) {
            ...
          },
          ...
        }

- ### sort-mode

    Sorts the rows by given expression.
  
    - `model.name`: Sort by row name
    - `from`: Sort by the earliest task from date of each row
    - `to`: Sort by the latest task to date of each row
    - `<expression>`: Sort using an angularJS expression (see [angularJS orderBy filter](https://docs.angularjs.org/api/ng/filter/orderBy)).
  
    Prepend a `-` in front to sort descending. E.g. `-from`

- ### task-out-of-range

    Behavior when tasks are defined out of the Gantt rendering range (see `from-date` and `to-date`).
  
    - `expand`: rendering range will be expanded to display the tasks entirely.
    - `truncate`: tasks will be truncated, or even totally hidden if they are not in rendering range at all.
    
    default: `expand`

- ### template

    Custom Gantt HTML template. If you want to customize the default Gantt HTML template, copy the content of
    template file `src/template/gantt.tmpl.html` to a variable and set this parameter. 
    
    Compared to `template-url`, this will avoid an additional request to load the template from an URL.

- ### template-url

    URL of custom Gantt HTML template. If you want to customize the default Gantt HTML template, make a copy of default
    template file `src/template/gantt.tmpl.html` to your own project, and set the URL of copied file to this
    attribute. 
      
    If `undefined` or `template/gantt.tmpl.html`, default template will be used.   
    
    *note: template-url must be different than `template/gantt.tmpl.html`, or it will use default
    template included in `angular-gantt.js`.*

- ### view-scale

    Column scale using any of [momentJS#add()](http://momentjs.com/docs/#/manipulating/add/) supported unit.
  
    - `second`
    - `minute`
    - `hour`
    - `day`
    - `week`
    - `month`
    - `quarter`
    - `year`
    
    default: `day`
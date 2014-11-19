(function(){
    'use strict';
    angular.module('gantt').filter('ganttTaskLimit', [function() {
        // Returns only the tasks which are visible on the screen
        // Use the task width and position to decide if a task is still visible

        return function(input, gantt) {
            var firstColumn = gantt.columnsManager.getFirstColumn();
            var lastColumn = gantt.columnsManager.getLastColumn();

            if (firstColumn !== undefined && lastColumn !== undefined) {
                var res = [];

                var scrollLeft = gantt.scroll.getScrollLeft();
                var scrollWidth = gantt.scroll.getScrollWidth();

                for (var i = 0, l = input.length; i < l; i++) {
                    var task = input[i];

                    if (task.active) {
                        res.push(task);
                    } else {
                        // If the task can be drawn with gantt columns only.
                        if (task.model.to > gantt.columnsManager.getFirstColumn().date && task.model.from < gantt.columnsManager.getLastColumn().endDate) {

                            // If task has a visible part on the screen
                            if (!scrollWidth ||
                                task.left >= scrollLeft && task.left <= scrollLeft + scrollWidth ||
                                task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollWidth ||
                                task.left < scrollLeft && task.left + task.width > scrollLeft + scrollWidth) {

                                res.push(task);
                            }
                        }
                    }
                }

                return res;
            } else {
                return input.splice();
            }
        };
    }]);
}());

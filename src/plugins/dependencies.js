(function(){
    'use strict';
    angular.module('gantt.dependencies', ['gantt', 'gantt.dependencies.templates']).directive('ganttDependencies', ['$timeout', '$document', 'ganttDebounce', 'GanttDependenciesManager', function($timeout, $document, debounce, DependenciesManager) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                jsPlumbDefaults: '=?'
                // Add other option attributes for this plugin
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.dependencies) === 'object') {
                    for (var option in scope.options.dependencies) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.jsPlumbDefaults === undefined) {
                    // https://jsplumbtoolkit.com/community/doc/defaults.html
                    scope.jsPlumbDefaults = {
                        Anchors: ['Right', 'Left'],
                        Endpoint: ['Dot', {radius: 7}],
                        Connector: 'Flowchart'
                    };
                }

                var manager = new DependenciesManager(ganttCtrl.gantt, scope);

                api.directives.on.new(scope, function(directiveName, directiveScope, directiveElement) {
                    if (directiveName === 'ganttBody') {
                        manager.plumb.setContainer(directiveElement);
                    }
                });

                api.tasks.on.add(scope, function(task) {
                    var taskDependencies = task.model.dependencies;

                    if (taskDependencies !== undefined) {
                        if (!angular.isArray(taskDependencies)) {
                            taskDependencies = [taskDependencies];
                        }

                        angular.forEach(taskDependencies, function(taskDependency) {
                            var toId = taskDependency.to;

                            if (toId !== undefined) {
                                manager.addDependency(task.model.id, toId, taskDependency.connectParameters);
                            }

                            var fromId = taskDependency.from;
                            if (fromId !== undefined) {
                                manager.addDependency(fromId, task.model.id, taskDependency.connectParameters);
                            }
                        });

                    }
                });

                api.tasks.on.remove(scope, function(task) {
                    var dependencies = manager.getTaskDependencies(task);

                    if (dependencies) {
                        angular.forEach(dependencies, function(dependency) {
                            dependency.disconnect();
                            manager.removeDependency(dependency.fromId, dependency.toId);
                        });
                    }
                });

                api.tasks.on.displayed(scope, debounce(function(tasks, filteredTasks, visibleTasks) {
                    manager.setTasks(visibleTasks);
                    manager.refresh();
                }, 10));

                api.rows.on.displayed(scope, function() {
                    manager.refresh();
                });

                api.tasks.on.viewChange(scope, function(task) {
                    if (task.$element) {
                        manager.plumb.revalidate(task.$element[0]);
                    }
                });

                api.tasks.on.viewRowChange(scope, debounce(function(task) {
                    manager.setTask(task);
                }, 10));

            }
        };
    }]);
}());

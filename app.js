/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'NewKanbanApp.Application',

    name: 'NewKanbanApp',

    requires: [
        // This will automatically load all classes in the NewKanbanApp namespace
        // so that application classes do not need to require each other.
        'NewKanbanApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'NewKanbanApp.view.main.Main'
});

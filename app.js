/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'newapp.Application',

    name: 'newapp',

    requires: [
        // This will automatically load all classes in the newapp namespace
        // so that application classes do not need to require each other.
        'newapp.*'
    ],

    // The name of the initial view to create.
    mainView: 'newapp.view.Main'
});

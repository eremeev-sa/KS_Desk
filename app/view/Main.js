Ext.define('newapp.view.Main', {
    extend: 'Ext.container.Viewport',
    requires: [
        'newapp.view.Login'
    ],

    layout: 'center',

    items: [
        {
            xtype: 'loginform'
        }
    ]
});

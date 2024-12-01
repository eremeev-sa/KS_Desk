Ext.define('newapp.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'loginform',

    title: 'Авторизация',
    bodyPadding: 10,
    width: 300,
    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Login',
            name: 'login',
            allowBlank: false
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Password',
            name: 'password',
            inputType: 'password',
            allowBlank: false
        }
    ],
    buttons: [
        {
            text: 'Submit',
            handler: function () {
                const form = this.up('form').getForm();
                if (form.isValid()) {
                    openDataWindow();
                } else {
                    Ext.Msg.alert('Ошибка', 'Не заполнены обязательные поля!');
                }
            }
        }
    ]
});

function openDataWindow() {
    const data = generateFakeData();

    const grid = Ext.create('Ext.grid.Panel', {
        store: Ext.create('Ext.data.Store', {
            fields: ['checked', 'name'],
            data: data
        }),
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        columns: [
            { text: 'Name', dataIndex: 'name', flex: 1 }
        ],
        height: 200,
        width: 400
    });

    const dataWindow = Ext.create('Ext.window.Window', {
        title: 'Выберите записи',
        layout: 'fit',
        modal: true,
        items: [grid],
        buttons: [
            {
                text: 'OK',
                handler: function () {
                    const selectedRecords = grid.getSelectionModel().getSelection();
                    if (selectedRecords.length > 0) {
                        openMainPanel(selectedRecords);
                        dataWindow.close();
                    } else {
                        Ext.Msg.alert('Ошибка', 'Выберите хотя бы одну запись!');
                    }
                }
            },
            {
                text: 'Cancel',
                handler: function () {
                    dataWindow.close();
                }
            }
        ]
    });

    dataWindow.show();
}

function generateFakeData() {
    return Array.from({ length: 10 }, () => ({
        name: faker.person.firstName()
    }));
}



function openMainPanel(selectedRecords) {
    const selectedData = selectedRecords.map(record => record.getData());

    Ext.create('Ext.container.Viewport', {
        layout: 'vbox',
        items: [
            {
                xtype: 'form',
                title: 'Панель',
                bodyPadding: 10,
                width: '100%',
                defaultType: 'textfield',
                items: [
                    { fieldLabel: 'Login', name: 'login' },
                    { fieldLabel: 'Password', name: 'password', inputType: 'password' }
                ]
            },
            {
                xtype: 'grid',
                title: 'Выбранные записи',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name'],
                    data: selectedData
                }),
                columns: [
                    { text: 'Name', dataIndex: 'name', flex: 1 }
                ],
                height: 200,
                width: '100%'
            }
        ]
    });
}

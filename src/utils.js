function addEventListeners(evts, fnc, useCapture = false, obj = window) {
    evts.forEach((evt) => {
        obj.addEventListener(evt, fnc, useCapture);
    });
};

function removeEventListeners(evts, fnc, useCapture = false, obj = window) {
    evts.forEach((evt) => {
        obj.removeEventListener(evt, fnc, useCapture);
    })
};

const DATA_TABLE = [
    {
        name: '1.address_1',
        label: 'address_1',
    },
    {
        name: '2.address_2',
        label: 'address_2',
    },
    {
        name: '3.address_3',
        label: 'address_3',
    },
    {
        name: '4.postcode',
        label: 'postcode',
    },
    {
        name: '5.country',
        label: 'country',
    },
];

export { addEventListeners, removeEventListeners, DATA_TABLE };
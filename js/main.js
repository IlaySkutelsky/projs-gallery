'use strict'

$(document).ready(init)

function init() {
    console.log('ready!');

    renderProjs()
}


function renderProjs() {
    var projs = getProjsForDisplay();

    var headingHTML = `<div class="row">
                        <div class="col-lg-12 text-center">
                          <h2 class="section-heading">Portfolio</h2>
                          <h3 class="section-subheading text-muted">Some examples of my projects</h3>
                        </div>
                      </div>
                      <div class="row">`

    var strHTMLs = projs.map(function (proj, projIdx) {
        return `
                    <div class="col-md-4 col-sm-6 portfolio-item">
                      <a class="portfolio-link" data-toggle="modal" href="#portfolioModal" onclick=renderModal(${projIdx})>
                        <div class="portfolio-hover">
                          <div class="portfolio-hover-content">
                            <i class="fa fa-plus fa-3x"></i>
                          </div>
                        </div>
                        <img class="img-fluid" src="img/portfolio/${proj.id}.jpg" alt="">
                      </a>
                      <div class="portfolio-caption">
                        <h4>${proj.name}</h4>
                        <p class="text-muted">${proj.title}</p>
                      </div>
                    </div>
                    `
    })

    $('#portfolio .container').html(headingHTML + strHTMLs.join(''))
}

function sendMsg() {
    var msgSubject = $('.msg-subject').val();
    var msgBody = $('.msg-body').val();
    var msgUrl = `
            https://mail.google.com/mail/?view=cm&fs=1&to=ilay.skutelsky@gmail.com&su=${msgSubject}&body=${msgBody}
                 `
    window.location = msgUrl;
}

function renderModal(projIdx) {
    var proj = getProjByIdx(projIdx)

    $('.portfolio-modal h2').text(proj.name);
    $('.portfolio-modal .item-intro').text(proj.title);
    $('.portfolio-modal img').attr('src', 'img/portfolio/'+proj.id+'.jpg');
    $('.portfolio-modal .item-desc').text(proj.desc);
    $('.portfolio-modal ul').html(`
                                    <li>Date: ${timeConverter(proj.publishedAt)}</li>
                                    <li>Client: Coding Academy</li>
                                    <li>Category: ${proj.labels.join(', ')}</li>
                                    <li><a href="../projs-gallery/${proj.url}">link</a></li>
                                 `)    
}

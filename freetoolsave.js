//--------------------------------------------------------------
// generic initialization....
//--------------------------------------------------------------

window.onload = function () {
    // Focus first field without scrolling (avoids scroll jump on reload when autofocus was used)
    var businessNameEl = document.getElementById('business_name');
    if (businessNameEl) {
        businessNameEl.focus({
            preventScroll: true
        });
    }
}


let template_design = 1;        // default standard.. 
let isInstantSaveCancelled = false;

// ID-to-Number Mapping
const TEMPLATE_MAP = {
    'standard': 1,
    'letter-head': 2,
    'without-head': 3
};


// --------------------------------------------------------------
// meet js for image rendering.
// --------------------------------------------------------------
async function getImageData() {
    const input = document.getElementById('add-logo');
    const file = input.files[0];

    if (!file) {
        console.warn('No file selected');
        return null;
    }

    // We wrap the FileReader in a Promise so we can "await" the result
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = reader.result;
            resolve(base64Data); // This "returns" the data to our await call
        };

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file); // This starts the conversion to Base64
    });
}

// ---------------------------------------------------------------
//  some generic js.....
// --------------------------------------------------------------- 

var webapp_url = "https://betaapp.mooninvoice.com/live_webapp/";

var loadFile = function (event) {
    var file = event.target.files[0];
    var output = document.getElementById('ffffffffffff');
    var errorContainer = document.querySelector('.companylogo_er');

    // Clear previous error
    errorContainer.textContent = '';

    // Check if a file is selected
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        errorContainer.textContent = 'Please upload a valid image file.';
        event.target.value = ''; // Clear the input
        output.src = 'https://cdn.mooninvoice.com/image/images/add-logo.svg'; // Reset preview
        $('.add-logo-label').removeClass('logo-preview');
        return;
    }

    // Show the preview
    output.src = URL.createObjectURL(file);
    $('.add-logo-label').addClass('logo-preview');
};

var btn = $('.scroll_top_div');

$(window).scroll(function () {
    if ($(window).scrollTop() > 30) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function (e) {
    // Prevent default behavior
    e.preventDefault();
    e.stopImmediatePropagation();

    // Smooth scroll to top
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

$('body').on('click', '.close-add-logo', function () {
    $('#add-logo').val('');
    var output = document.getElementById('ffffffffffff');
    output.src = "https://cdn.mooninvoice.com/image/images/add-logo.svg";
    $('.add-logo-label').removeClass('logo-preview');
    document.querySelector('.companylogo_er').textContent = '';
});

$('.toogle_menu').on("click", function (e) {
    $('.togglemenu').toggleClass('side-open');
    $('.footer_invoice').toggleClass('sidebar-open');
    $('.header_invoice').toggleClass('sidebar-open');
    $('.body_invoice').toggleClass('sidebar-open');
    $('.body_wrap').toggleClass('sidebar-open');
    $('body').toggleClass('aside-open');
    e.stopPropagation();
});
$(document).on("click", function () {
    if ($(window).width() < 991) {
        $('.togglemenu').removeClass('side-open');
        $('.footer_invoice').removeClass('sidebar-open');
        $('.header_invoice').removeClass('sidebar-open');
        $('.body_invoice').removeClass('sidebar-open');
        $('body').removeClass('aside-open');
        $('.body_wrap').removeClass('sidebar-open');
        $('.togglemenu').removeClass('mobile-side-open');
    }
});

$(document).ready(function () {

    var speed = 400;

    // 1. Hide all panel bodies first
    $(".accpanelbody").hide();

    // 2. Open first panel on page load
    $(".accrdPanel")
        .first()
        .addClass("open active")
        .find(".accpanelbody")
        .slideDown(speed);

    // 3. Click handler
    $(".accrdPanelHeading").on("click", function () {
        var currentPanel = $(this).closest(".accrdPanel");
        var currentBody = currentPanel.find(".accpanelbody");

        // If clicked panel is already open → close it
        if (currentPanel.hasClass("open")) {
            currentPanel
                .removeClass("open active")
                .find(".accpanelbody")
                .stop(true, true)
                .slideUp(speed);
        }
        // Else → close others & open clicked one
        else {
            $(".accrdPanel.open")
                .removeClass("open active")
                .find(".accpanelbody")
                .stop(true, true)
                .slideUp(speed);

            currentPanel
                .addClass("open active")
                .find(".accpanelbody")
                .stop(true, true)
                .slideDown(speed);
        }
    });
});

$('.click_chat').on("click", function () {
    $('.cc-ge4v').attr('data-visible', 'true');
});


// ---------------------------------------------------------------
// ui icons js.....
// ---------------------------------------------------------------

//  Select template modal js 
function updateInvTplHeight() {
    const grid = document.querySelector(".invTpl-grid");
    if (!grid) return;

    const h = window.innerHeight;

    if (h < 800) {
        grid.style.maxHeight = "80dvh";
    } else {
        grid.style.maxHeight = "90dvh";
    }

    grid.style.overflowY = "auto";
}

/* 🔒 lock scroll properly */
function lockInvTplScroll() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    // document.body.style.paddingRight = scrollBarWidth + "px";
}

/* 🔓 unlock scroll */
function unlockInvTplScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}

function invTplOpen() {
    const el = document.getElementById("invTplContainer");

    el.style.display = "flex";

    // 🔒 stop background scroll
    lockInvTplScroll();

    setTimeout(() => {
        el.classList.add("show");

        updateInvTplHeight();
    }, 10);
}

function invTplClose() {
    const el = document.getElementById("invTplContainer");

    el.classList.remove("show");

    setTimeout(() => {
        el.style.display = "none";

        // 🔓 restore background scroll
        unlockInvTplScroll();
    }, 300);
}

function invTplSelect(el) {
    if (el.classList.contains("invTpl-locked")) return;

    document.querySelectorAll(".invTpl-inner").forEach(c => {
        c.classList.remove("active");
    });

    el.classList.add("active");
}

/* 🔁 responsive update */
window.addEventListener("resize", () => {
    updateInvTplHeight();
});


//-------------------------------------------------------------------------
// download button 
//-------------------------------------------------------------------------

/**
 * Perform direct download or print action
 * @param {string} action - 'download' or 'print'
 */
window.performDocumentAction = function (action) {
    if (typeof pdfContent !== 'undefined' && pdfContent) {
        if (action === 'print') {
            if (typeof printPDF === 'function') {
                printPDF();
            } else {
                console.error("printPDF function not found");
            }
        } else {
            const link = document.createElement('a');
            link.href = pdfContent;
            link.download = (window.downloadPageName.charAt(0).toUpperCase() + downloadPageName.slice(1) + '# ' + window.pdfname || 'Document') + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } else {
        alert('PDF content is not ready. Please wait or try again.');
    }
};

const openBtn = document.getElementById("download-modal-trigger");

const modal = document.querySelector(".download-modal-overlay");
const closeBtn = document.querySelector(".download-modal-close");

// Get scrollbar width
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

// Open modal
openBtn.addEventListener("click", (e) => {
    // Bypass modal if user has already submitted
    if (localStorage.getItem('user_submit') == 'true' || window.user_submitted) {
        const action = openBtn.getAttribute('data-action') || 'download';
        performDocumentAction(action);
        return;
    }

    const scrollBarWidth = getScrollbarWidth();

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollBarWidth + "px";

    /* ── Update modal labels based on $page_name set in the Blade template ── */
    var pageName = window.downloadPageName || 'Invoice'; // fallback to "Invoice"
    var action = openBtn.getAttribute('data-action') || 'download';
    var verb = action === 'print' ? 'Print' : 'Download';
    var titleEl = document.getElementById('downloadModalTitle');
    var subtitleEl = document.getElementById('downloadModalSubtitle');
    var btnEl = document.getElementById('downloadModalBtn');
    if (titleEl) titleEl.textContent = verb + ' ' + pageName;
    if (subtitleEl) subtitleEl.textContent = 'Please provide your information to ' + verb.toLowerCase() + ' the ' + pageName.toLowerCase();
    if (btnEl) {
        btnEl.textContent = verb + ' ' + pageName;
        btnEl.setAttribute('data-action', action);
    }
    /* ──────────────────────────────────────────────────────────────────────── */

    modal.classList.add("active");
});

// Print button — opens the same modal with "Print {page_name}" labels
const printBtn = document.getElementById("print-modal-trigger");
if (printBtn) {
    printBtn.addEventListener("click", (e) => {
        // Bypass modal if user has already submitted
        if (localStorage.getItem('user_submit') == 'true' || window.user_submitted) {
            performDocumentAction('print');
            return;
        }

        const scrollBarWidth = getScrollbarWidth();

        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = scrollBarWidth + "px";
        var pageName = window.downloadPageName || 'Invoice';
        var titleEl = document.getElementById('downloadModalTitle');
        var subtitleEl = document.getElementById('downloadModalSubtitle');
        var btnEl = document.getElementById('downloadModalBtn');
        if (titleEl) titleEl.textContent = 'Print ' + pageName;
        if (subtitleEl) subtitleEl.textContent = 'Please provide your information to print the ' + pageName.toLowerCase();
        if (btnEl) {
            btnEl.textContent = 'Print ' + pageName;
            btnEl.setAttribute('data-action', 'print');
        }
        modal.classList.add("active");
    });
}

// Handle click on the modal button (Download or Print)
const downloadModalBtn = document.getElementById("downloadModalBtn");
if (downloadModalBtn) {
    downloadModalBtn.addEventListener("click", () => {
        const action = downloadModalBtn.getAttribute('data-action');

        // console.log(action); 

        if (action === 'print') {
            // Call the existing printPDF function
            // printPDF();

            // Close the modal after triggering print
            if (modal) modal.classList.remove("active");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        } else {
            // This is the default "Download" behavior
            // The existing lead capture logic (if any) should go here
            console.log("Download action triggered");
        }
    });
}

// Close modal
closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    jobValue.innerText = "";
    jobGroup.classList.remove("active", "open");
    jobOptions.forEach(opt => opt.classList.remove('active'));
    setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    }, 300);

    // reset download modal.    
    document.getElementById("downloadForm").reset();


});
// custom js for field

const countries = [{
    name: 'Afghanistan',
    code: '+93',
    iso: 'af'
},
{
    name: 'Albania',
    code: '+355',
    iso: 'al'
},
{
    name: 'Algeria',
    code: '+213',
    iso: 'dz'
},
{
    name: 'Argentina',
    code: '+54',
    iso: 'ar'
},
{
    name: 'Australia',
    code: '+61',
    iso: 'au'
},
{
    name: 'Belgium',
    code: '+32',
    iso: 'be'
},
{
    name: 'Brazil',
    code: '+55',
    iso: 'br'
},
{
    name: 'Canada',
    code: '+1',
    iso: 'ca'
},
{
    name: 'China',
    code: '+86',
    iso: 'cn'
},
{
    name: 'France',
    code: '+33',
    iso: 'fr'
},
{
    name: 'Germany',
    code: '+49',
    iso: 'de'
},
{
    name: 'Japan',
    code: '+81',
    iso: 'jp'
},
{
    name: 'Mexico',
    code: '+52',
    iso: 'mx'
},
{
    name: 'Pakistan',
    code: '+92',
    iso: 'pk'
},
{
    name: 'Russia',
    code: '+7',
    iso: 'ru'
},
{
    name: 'Singapore',
    code: '+65',
    iso: 'sg'
},
{
    name: 'United Arab Emirates',
    code: '+971',
    iso: 'ae'
},
{
    name: 'United Kingdom',
    code: '+44',
    iso: 'gb'
},
{
    name: 'United States',
    code: '+1',
    iso: 'us'
}
];

const list = document.getElementById('countryList');
countries.forEach(c => {
    const li = document.createElement('li');
    li.className = 'login-country-item';
    li.onclick = () => selectCountry(c.name, c.code, c.iso);
    li.innerHTML = `
                    <img src="https://flagcdn.com/w20/${c.iso}.png" class="login-flag-icon" style="margin-right: 12px;">
                    <span class="login-country-name">${c.name}</span>
                    <span class="login-country-code">${c.code}</span>
                `;
    list.appendChild(li);
});

function toggleDropdown(e) {
    e.stopPropagation();
    document.getElementById('countryDropdown').classList.toggle('show');
    document.getElementById('countrySearch').focus();
}

function selectCountry(name, code, iso) {
    document.getElementById('selectedFlag').src = `https://flagcdn.com/w20/${iso}.png`;
    document.getElementById('selectedCode').innerText = code;
    document.getElementById('countryDropdown').classList.remove('show');
}

function filterCountries() {
    const val = document.getElementById('countrySearch').value.toLowerCase();
    document.querySelectorAll('.login-country-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(val) ? 'flex' : 'none';
    });
}


window.onclick = () => document.getElementById('countryDropdown').classList.remove('show');





const jobGroup = document.getElementById('jobRoleGroup');
const jobTrigger = document.getElementById('jobRoleTrigger');
const jobValue = document.getElementById('jobRoleValue');
const jobOptions = document.querySelectorAll('.download-modal-option');

// Toggle open state on trigger click
jobTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    jobGroup.classList.toggle('open');
    // If we are opening it, label should float up
    if (jobGroup.classList.contains('open')) {
        jobGroup.classList.add('active');
    } else if (jobValue.innerText === "") {
        // If closing and no value, return label to center
        jobGroup.classList.remove('active');
    }
});

// Handle option selection
jobOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedText = option.innerText;
        jobValue.innerText = selectedText;

        // Update active state in list
        jobOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Close panel and keep label floated
        jobGroup.classList.remove('open');
        jobGroup.classList.add('active');
    });
});

// Close when clicking anywhere outside
window.addEventListener('click', () => {
    jobGroup.classList.remove('open');
    // Reset label position if no value was chosen
    if (jobValue.innerText === "") {
        jobGroup.classList.remove('active');
    }
});


// ---------------------------------------------------------------
// document render and form handling with and pdf showing......
// ---------------------------------------------------------------

$(document).ready(function (e) {
    var counter = 2;
    $(".shipping_cost").blur(function () {
        var shipping_length = $(this).val().length;
        if (shipping_length === 0) {
            $(".checkLabl").removeClass("blank_space");
        } else {
            $('.checkLabl').addClass("blank_space");
        }
    });

    $(document).on('click', '.delete_item', function () {
        var for_val = $(this).attr('for');
        $("#delete_item_" + for_val).remove();
        getTotalCost(for_val);
        table_tr--;
        reOrderRows();

    });

    function reOrderRows() {
        $("#invoice_list tr").each(function (index, el) {
            index += 1;
            if (index === 0)
                return false;

            $(this).children('td').first().text(index++);
        });
    }
    var date = new Date().toLocaleDateString('en-US');
    $(function () {
        var todaydt = new Date();
        $("#customer_date").datepicker({
            autoclose: true,
            endDate: todaydt,
            minDate: 0,
            onSelect: function (date) {
                //Get selected date 
                var date2 = $('#customer_date').datepicker('getDate');
                //sets minDate to txt_date_to
                $('#customer_due_date').datepicker('option', 'minDate', date2);
            }
        }).val(date);
        $('#customer_due_date').datepicker({
            minDate: 0
        }).val(date);
    });

    var currency_symbol = '';



    // Set Currency 
    // https://betaapp.mooninvoice.com/live_webapp/get_currencies_public


    $.ajax({

        url: webapp_url + 'get_currencies_public',
        type: "POST",
        success: function (data) {
            // console.log(data);
            try {
                var jss = typeof data === 'string' ? JSON.parse(data) : data;
                if (jss && jss.data) {
                    $.each(jss.data, function (key, val) {
                        if (val.displayNameString === 'English' && val.is_delete === 0) {
                            var selected = '';
                            if (val.code == "USD") {
                                default_currecy = val.symbol;
                                selected = "selected";
                            }
                            window.curr_symbol = val.symbol ?? 'USD';
                            $("#customer_currency").append('<option value="' + val
                                .currencylocale + '" ' + selected + ' data-symbol="' + curr_symbol + '">' + val.currency_name + '</option>');
                            // $("#customer_currency").append("<option value='"+ val.symbol +"' "+ if(val.symbol == '$') { "selected" } +" >"+val.currency_name +"</option>");
                        }
                    });
                }
            } catch (e) {
                console.error("JSON parse error in get_currencies_public:", e);
            }
        }
    });

    if (default_currecy != '') {
        $('.add_symbol').text(default_currecy);
    } else {
        $('.add_symbol').html("$");
    }

    // Set Shipping Method
    // https://betaapp.mooninvoice.com/live_webapp/get_shipping_methods_public
    $.ajax({
        url: webapp_url + 'get_shipping_methods_public',
        type: 'POST',
        success: function (data) {
            // console.log(data);
            try {
                var shipping_method = typeof data === 'string' ? JSON.parse(data) : data;
                if (shipping_method && shipping_method.data) {
                    $.each(shipping_method.data, function (key, val) {

                        $("#shipping_method").append('<option value="' + val.name + '">' + val
                            .name + '</option>');
                    });
                }
            } catch (e) {
                console.error("JSON parse error in get_shipping_methods_public:", e);
            }
        }
    });


    $('body').on('change', function () {
        window.currency_symbol = $("#customer_currency").find(':selected').data('symbol');
        $(".add_symbol").text(window.currency_symbol);
    });
    // $('.add_symbol').text(currency_symbol);

    function validateEmailField() {

        let email = $('#business_email').val().trim();
        let $errorContainer = $('.business-email-test');

        $errorContainer.find('.email-error').remove();
        let isValid = true;

        if (email === '') {
            $errorContainer.append(
                '<span class="error email-error bottom-0" id="business_email-error" for="business_email">Email is required.</span>'
            );
            isValid = false;
        } else {
            var checkMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

            if (!checkMail) {
                $errorContainer.append(
                    '<p class="error email-error" id="business_email-error" for="business_email">Invalid email address.</p>'
                );
                let emailInput = document.getElementById('business_email');
                emailInput.style.setProperty('color', 'red', 'important');
                emailInput.style.setProperty('font-size', '12px', 'important');
                isValid = false;
            }
        }

        if (isValid) {
            let emailInput = document.getElementById('business_email');
            emailInput.style.setProperty('color', 'black', 'important');
            emailInput.style.setProperty('font-size', '16px', 'important');
        }
        return isValid;
    }

    $('#business_email').on('input', function () {
        validateEmailField();
    });

    $("#invoice_signup_form").validate({
        rules: {
            business_name: {
                required: true,
                minlength: 3,
                normalizer: function (value) {
                    return $.trim(value); // Trim spaces only before validation
                }
            },
            customer_detail: {
                required: true,
                minlength: 3,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            business_address: {
                required: true,
                minlength: 3,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            customer_invoice: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            business_name: {
                required: "Business name is required.",
                minlength: "Min length 3 char"
            },
            customer_detail: {
                required: "Customer is required.",
                minlength: "Min length 3 char"
            },
            business_address: {
                required: "Business Address is required.",
                minlength: "Min length 3 char"
            },
            customer_invoice: {
                required: page_name.charAt(0).toUpperCase() + page_name.slice(1) + " Number is required.",
            },
        },
        errorElement: 'label',
        errorPlacement: function (error, element) {
            if (element.attr('name') == 'business_name') {
                error.insertAfter(".business_name_er");
            }
            if (element.attr('name') == 'customer_detail') {
                error.insertAfter(".customer_detail_er");
            }
            if (element.attr('name') == 'business_address') {
                error.insertAfter(".business_address_er");
            }
            if (element.attr('name') == 'customer_invoice') {
                error.insertAfter(".customer_invoice_er");
            }
        }
    });


    $("#main_tax_text").on("input", function () {
        $(this).css('border', '');
    });




    // my code-- meet
    $("#instantSaveBtn").on('click', async function (e) {
        e.preventDefault();
        isInstantSaveCancelled = false;
        lockInvTplScroll();

        const $link = $(this);

        // 1. Check if it's already "disabled" to prevent double-triggering
        if ($link.hasClass('is-loading')) {
            return false;
        }
        // 2. Visual and functional disable
        $link.addClass('is-loading').css({
            'pointer-events': 'none',
            'opacity': '0.5'
        });

        try {
            const validate_email = validateEmailField();
            $("#invoice_signup_form").valid();

            if ($("#invoice_signup_form").valid() && validate_email) {
                // ✅ Show modal instantly when user clicks Save
                const backdrop = document.getElementById('uniquePreviewBackdrop');
                const loader = document.getElementById('previewLoadingOverlay');
                if (backdrop) backdrop.style.display = 'flex';
                if (loader) loader.classList.remove('preview-hidden');

                // Disable print/download/watermark while loading
                $("#download-modal-trigger, #print-modal-trigger, .remove_watermark").css({
                    'pointer-events': 'none',
                    'opacity': '0.5'
                });

                $('.companylogo_er').text('');

                var gacookievalue = Cookies.get("_ga");
                var gacookievalue_final = gacookievalue.substr(6);
                var ga = gacookievalue_final;

                var utm_source_data = "<?php echo @$page_name; ?>";
                var utm_campaign_data = '';
                var utm_medium_data = 'website';

                var getfromurl = $("#getfromurl").val();

                if (getfromurl == 1) {
                    if (utm_source_data != '' || utm_campaign_data != '') {
                        localStorage.setItem("mi_ga_ref_url", utm_source_data + ',' + utm_medium_data +
                            ',' + utm_campaign_data);
                    }
                } else {
                    var mi_ga_ref_url = localStorage.getItem("mi_ga_ref_url");
                    console.log("mi_ga_ref_url : " + mi_ga_ref_url);

                    if (mi_ga_ref_url == '' || mi_ga_ref_url == "undefined,undefined" ||
                        mi_ga_ref_url ==
                        "undefined,undefined,undefined" || mi_ga_ref_url == null || mi_ga_ref_url ==
                        'Website,,' || mi_ga_ref_url == 'Website,undefined,undefined') {
                        var utm_campaign_data = '';
                        var utm_medium_data = 'website';
                    } else {
                        var mi_ga_ref_url = localStorage.getItem("mi_ga_ref_url").split(',');

                        if (mi_ga_ref_url[0] == '' || typeof mi_ga_ref_url[0] === "undefined") { } else {
                            utm_source_data = mi_ga_ref_url[0];
                        }

                        if (mi_ga_ref_url[2] == '' || typeof mi_ga_ref_url[2] === "undefined") { } else {
                            utm_campaign_data = mi_ga_ref_url[2];
                        }

                        if (mi_ga_ref_url[1] == '' || typeof mi_ga_ref_url[1] === "undefined") { } else {
                            utm_medium_data = mi_ga_ref_url[1];
                        }
                    }
                }

                if (campiondata_fornewheader == 1 && utm_campaign_data == '') {
                    utm_campaign_data = 'top-banner';
                }

                var utm_source = utm_source_data;
                var utm_campaign = utm_campaign_data;
                var utm_medium = utm_medium_data;



                var instantForm = $("#invoice_signup_form").serialize();
                var token = $('meta[name="csrf-token"]').attr('content');

                var form = $('#invoice_signup_form')[0];
                var formData = new FormData(form);
                //            var fd = new FormData();
                formData.append('ga', ga);
                formData.append('service_type', '1');
                formData.append('utm_source', utm_source);
                formData.append('utm_campaign', utm_campaign);
                formData.append('utm_medium', utm_medium);
                formData.append('page_name', "<?php echo @$page_name; ?>");
                formData.append('device_model', device_model);
                formData.append('device_os', os_name);
                formData.append('os_version', os_version);
                formData.append('browser', browser_name);
                formData.append('browser_version', browser_version);
                formData.append('device_id', ga);
                // formData.append('logo',sendBase64InFormData());

                // printing formdata collected. 
                // for (let [key, value] of formData.entries()) {
                //     console.log(key + ": ", value);
                // }

                // step-1 take formData object and convert to effective object.
                // const obj = Object.fromEntries(formData.entries());
                // console.log(obj);

                const obj = {};

                formData.forEach((value, key) => {
                    // If the key already exists, turn it into an array (or push to it)
                    if (obj.hasOwnProperty(key)) {
                        if (!Array.isArray(obj[key])) {
                            obj[key] = [obj[key]];
                        }
                        obj[key].push(value);
                    } else {
                        // If it's the first time seeing the key, just set it
                        obj[key] = value;
                    }
                });

                // localStorage.setItem("estimate_form", JSON.stringify(obj));

                // get base64 logo
                const base64Logo = await getImageData();
                if (isInstantSaveCancelled) return;

                if (base64Logo != {}) {
                    obj['companylogo'] = base64Logo;
                }

                // store to localstorage bcz it accepts only json.
                localStorage.setItem("estimate_form", JSON.stringify(obj));

                const estimate_form = JSON.parse(localStorage.getItem('estimate_form'));

                // text of modal-title.
                if (page_name == 'purchase Order') {
                    $('.preview-pdf').text("P.O.# " + estimate_form.customer_invoice );
                }
                else {
                    $('.preview-pdf').text(page_name.charAt(0).toUpperCase() + page_name.slice(1).toLowerCase() + "# " + estimate_form.customer_invoice);     // to change pdf title dynamically.
                }

                window.pdfname = estimate_form.customer_invoice;
                window.totaltaxamount = 0;

                // console.log(estimate_form);


                const data = {

                    "pageSize": "A4",
                    "customerID": "",
                    "PDFSettingsforInvoice": {
                        "serial_no_label": "Sr. No.",
                        "report_type": "1",
                        "Status_on_off": 1,
                        "full_pdf": "1",
                        "custom_template": "0",
                        "page_border": 1,
                        "sub_tittle": "1",
                        "generated_by": 1,
                        "supply_type": 1,
                        "generated_date": 1,
                        "valid_date": 1,
                        "cancelled_date": 1,
                        "transp_detail": 1,
                        "cancallation_details": 1,
                        "vehicle_detail": 1,
                        // change number for diffrent tamplete.
                        "template_number": template_design,             // 2== letter head, 
                        "selected_language": "en",
                        "hsn_sac_table": 0,
                        "qr_code": 1,
                        "logo": 1,
                        "Scalling": "2",
                        "Horizontal": "2",
                        "Vertical": "2",
                        "line_description_full_width": 1,
                        "banks_details_pdf": 1,
                        "t_banks_details_pdf": "1",
                        "AmountPaid": 1,
                        "C_Name_PDF": 1,
                        "Accepted_Pay_Method_Position": 1,
                        // toggle for rem water mark...
                        "invoice_hyperlink": 1,
                        "C_Address": 1,
                        "H_Lines": 1,
                        "shipping_method": 1,
                        "Vat_no_Cust": 1,
                        "append_projectin_invoice": "1",
                        "Contacts_Email": 1,
                        "task_rate": 1,
                        "product_table_image_show": 0,
                        "PDF_Page_Number": 0,
                        "Reg_No": 0,
                        "Terms_Notes_Full_Width": 0,
                        "hide_payment_number": 1,
                        "comman_layout": {
                            "selectedpagemargin": {
                                "left_margin": 30,
                                "right_margin": 30,
                                "top_margin": 30,
                                "bottom_margin": 30
                            },
                            "selectedFillColor": "rgba(211,211,211,1)",
                            "selectedFontColor": "rgba(0,0,0,1)",
                            "selectedboldfontstyle": "/pdf_fonts/arial/arial_bold.txt",
                            "selectedLineColor": "rgba(0,0,0,1)",
                            "selectedFillTextColor": "rgba(0,0,0,1)",
                            "selectedregularfontstyle": "/pdf_fonts/arial/arial_regular.txt"
                        },
                        "T_Termsandcondition": 1,
                        "AmountDue": 0,
                        "C_Phone": 1,
                        "PDF_Page_Number_alignment": 2,
                        "Sign_Date_Format": "1",
                        "Sum_inline_Discount": 1,
                        "Subtotal": 1,
                        "Signature_2": 1,
                        "Include_Outstanding": 0,
                        "task_amount": 1,
                        "Signature_1": 1,
                        "product_name": "1",
                        "C_Mobile": 1,
                        "C_Country": 1,
                        "Reg_No_Alignment_Cust": 1,
                        "Date_format": 1,
                        "str_Header": 1,
                        "S_AddAlignment": 1,
                        "ShippingCost": 1,
                        "item_codes": 1,
                        "Termsandcondition": 1,
                        "serial_no": 1,
                        "compact_mode": 0,
                        "sub_title": 1,
                        "physical_sign_1": "1",
                        "physical_sign_2": 0,
                        "inline_notes": 1,
                        "product_unitprice": 1,
                        "task_name": "1",
                        "TitleAlignment": 0,
                        "Discount": 1,
                        "Total_Amount": 1,
                        "Cust_Home": 1,
                        "Cust_Fax": 1,
                        "ContactFirstLastName": 1,
                        "Company_URL": 1,
                        "tax_summary": 1,
                        "Email_Cont_Alignment": 0,
                        "product_quantity": 1,
                        "Cust_Business": 1,
                        "T_Notes": 1,
                        "Reg_No_Alignment": 0,
                        "Tax_Per_Value": 1,
                        "taxable_amount": 1,
                        "sub_title_alignment": 1,
                        "Accepted_Pay_Method_Show": 1,
                        "C_Email": 1,
                        "Notes": 1,
                        "Cust_Mobile": 1,
                        "product_amount": 1,
                        "rounded_value": "0",
                        "V_Lines": 1,
                        "Due_Date": 1,
                        "product_discount": 1,
                        "Payment_Details_Invoice": 0,
                        "Invoice_Number": 1,
                        "CreditNote_Number_invoice": 0,
                        "invoice_Number_creditnote": 0,
                        // estimate number.
                        "Estimate_Number": Number(estimate_form.customer_invoice),
                        "Sales_Number": "1",
                        "PO_Number": "1",
                        "CreditNote_no": "1",
                        "Paypalbtn_alignment": 0,
                        "Mobile_cont_Alignment": 0,
                        "task_quantity": 1,
                        "task_discount": 1,
                        "Total": 1,
                        "Reg_No_Cust": 1,
                        "Po_no": 1,
                        "Vat_no": 1,
                        "template_background": 0,
                        "F_Color": "1",
                        "tax_summary_data": 1,
                        "amount_used": 1,
                        "amount_remains": 1,
                        "B_AddAlignment": 0,
                        "total_hours_quantity": 0,
                        "show_price_with_tax": 2,
                        "allow_minus_value": 0,
                        "Show_Currency_Symbol": 1,
                        "Show_Currency_Code": 0,
                        "Payment_Note": 0,
                        "C_Fax": 1,
                        "show_sac": 1,
                        "show_hsn": 1,
                        "einvoice_ack_date_show": 1,
                        "einvoice_ack_no_show": 1,
                        "einvoice_detail_show": 0,
                        "einvoice_irn_show": 1,
                        "einvoice_qr_code_show": 1,
                        "duplicate_label": "(Original)",
                        "duplicate_label_show": 1,
                        "duplicate_label_font_size": "14",
                        "service_product_order": 1,
                        "tax_amount_column_value": 0,
                        "variant_size": 0,
                        "variant_type": 0,
                        "ReturnOrder": 1,
                        "single_total": 0,
                        "credit_note_apply": 0,
                        "qr_code_align": "1",
                        "serial_imei_pdf": 1,
                        "batch_name_pdf": 1,
                        "exp_date_pdf": 1,
                        "mfg_date_pdf": 1,
                        "num_to_word_show": 1
                    },
                    "invoice_report": {
                        "transportation_details": {
                            "name": "",
                            "name_label": "Name",
                            "id": "6878EEF5",
                            "id_label": "Transporter ID",
                            "transportation_details_label": "Transporter Details",
                            "style": {
                                "font_size": 10
                            }
                        },
                        "vehicle_details": {
                            "vehicle_details_label": "Vehicle Details",
                            "doc_no_label": "Doc No",
                            "date_label": "Doc Date",
                            "CEWB_no_label": "CEWB No",
                            "from_label": "From",
                            "mode_label": "Mode of Transport",
                            "total_distance_label": "Total Distance",
                            "style": {
                                "font_size": 10
                            },
                            "reason_label": "Reason",
                            "remark_label": "Remark",
                            "vehicle_details": [{
                                "doc_no": "DAEKOKS54",
                                "CEWB_no": "65456465",
                                "date": "",
                                "mode": "",
                                "from": "",
                                "total_distance": "",
                                "reason": "",
                                "remark": "",
                                "vehicle_no": ""
                            }]
                        },
                        "cancellation_details": {
                            "reason": "Duplicate",
                            "reason_label": "Reason",
                            "remark": "",
                            "remark_label": "Remark",
                            "cancellation_details_label": "Cancellation Details",
                            "style": {
                                "font_size": 10
                            }
                        },
                        "pdf_status_image": "",
                        "phone_no_label": "Phone",
                        "company_email_label": "Email",
                        "mobile_no_label": "Mobile Numer",
                        "reg_no_label": "Reg. No",
                        "vat_no_label": "Tax ID",
                        "company_fax_no_label": "Fax No",
                        // moon logo.
                        "hyperlink_image": 'data:image/png;base64,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',
                        "num_to_word_label": "Total in Words",
                        "currency": "Rupee",
                        "sub_currency": "Paise",
                        "company_name_title_style": {
                            "font_size": 15
                        },
                        // thisis country.
                        "country": estimate_form.business_country,
                        "phone_no": "",
                        "firstname": "",
                        "flname": "",
                        "lastname": "",

                        // customername.
                        "peoplename": estimate_form.customer_detail,
                        "invoice_table": {
                            "valid_date_label": "Valid Till",
                            "valid_date": estimate_form.customer_date,
                            "cancelled_date_label": "",
                            "cancelled_date": "",
                            "generated_date": '',
                            "generated_date_label": "Generated Date",
                            "supply_type_label": "Supply Type",
                            "supply_type": "",
                            "generated_by_label": "Generated By",
                            "generated_by": estimate_form.customer_detail,
                            "invoice_po_label": "P.O. #",
                            "invoice_number_label": page_name === 'purchase Order' ? 'P.O.#' : (page_name.charAt(0).toUpperCase() + page_name.slice(1) + " #"),
                            "invoice_outstanding_label": "Outstanding",
                            "invoice_date": estimate_form.customer_date,
                            "invoice_total_label": "Total",
                            "invoice_table_style": {
                                "font_size": 10
                            },
                            "invoice_duedate_label": "Due Date",
                            "invoice_outstanding": [{
                                "symbol": "₹",
                                "code": estimate_form.customer_currency,
                                "selectedcurrency": estimate_form.customer_currency,
                                "ammountdue": Number(estimate_form["sub_amout_due[]"])
                            }],
                            "invoice_total": estimate_form["total_with_tax_and_price[]"],
                            // date title 
                            "invoice_date_label": page_name.charAt(0).toUpperCase() + page_name.slice(1) + " date",
                            "invoice_po_number": estimate_form.billing_po,
                            "invoice_number": estimate_form.customer_invoice,
                            "invoice_duedate": estimate_form.customer_due_date,
                            "estimate_number_label": "Estimate #"
                        },
                        "notes": {
                            "notes_value_style": {
                                "font_size": 9
                            },
                            "notes_label": "Notes",

                            // show in note......
                            "notes_value": estimate_form.notes,
                            "notes_label_style": {
                                "font_size": 10
                            }
                        },
                        "reg_no": "",

                        //  city 
                        "city": estimate_form.business_city,
                        "bank_details": {
                            "bank_details_value": "",
                            "bank_details_label": "Bank Details",
                            "bank_details_label_style": {
                                "font_size": 10
                            },
                            "bank_details_value_style": {
                                "font_size": 9
                            }
                        },
                        "pin_code": "",
                        // curruncy
                        // "selected_currency": (estimate_form.customer_currency) ? estimate_form.customer_currency : "₹",
                        "selected_currency": window.currency_symbol,
                        "mobile_no": "",

                        // business email.
                        "company_email": estimate_form.business_email,

                        // business address.
                        "billing_address": {
                            "home_no": '',
                            "billing_address_label_style": {
                                "font_size": 9
                            },
                            "business_no": "",
                            "billing_country": estimate_form.billing_country,
                            "billing_pin_code": estimate_form.billing_po,
                            "billing_address_label": page_name.charAt(0).toUpperCase() + page_name.slice(1) + "To:",
                            "billing_address_customer": "",
                            "firstname": "",
                            "lastname": "",
                            "contact_email": '',
                            "billing_vat_no": "",
                            "billing_city": estimate_form.billing_city,
                            "billing_mobile_no": "",
                            "full_name": estimate_form.customer_detail,
                            "billing_state": estimate_form.billing_state,
                            "billing_street_2": estimate_form.billing_street_2,
                            "billing_reg_no": "",
                            "billing_street_1": estimate_form.billing_street_1,
                            "fax_no": ""
                        },
                        // billing data.
                        "bill_from_address": {
                            "address_label": "From",
                            "street_1": '',
                            "street_2": '',
                            "city": '',
                            "state": '',
                            "pin_code": '',
                            "country": '',
                            "address_customer": '',
                            "address_label_style": {
                                "font_size": 9
                            }
                        },
                        "dispatch_address": {
                            "address_label": "Dispatch From",
                            "street_1": '',
                            "street_2": '',
                            "city": '',
                            "state": '',
                            "pin_code": '',
                            "country": '',
                            "address_customer": '',
                            "address_label_style": {
                                "font_size": 9
                            }
                        },
                        "einvoice": "",
                        "invoice_hyperlink": "Created by",
                        "payment_methods": {
                            "payment_method_all_image": [],
                            "paynow_image": "",
                            "paynow_image_link": "",
                            "payment_methods_label": "We accept payment by"
                        },

                        //company
                        "company_logo": (estimate_form.companylogo) ? estimate_form.companylogo : "",
                        "company_logo_width": 150,
                        "company_logo_height": 150,
                        "company_logo_size": "Medium",
                        "lang_code": "en-IN",
                        // currency code.
                        "currency_code": (estimate_form.customer_currency) ? estimate_form.customer_currency : "INR",
                        "payment_table": {
                            "payment_amount_label": "Amount",
                            "payment_number_label": "Payment #",
                            "payment_type_label": "Payment Type",
                            "payment_details_label_style": {
                                "font_size": 11
                            },
                            "payment_data": [{
                                // estimate date.
                                "payment_date": estimate_form.customer_date,
                                "payment_number": "01",
                                "payment_type": "Stripe",
                                "payment_note": estimate_form.notes,
                                "payment_amount": estimate_form["total_with_tax_and_price[]"] || ""
                            }],
                            "payment_date_label": "Estimate date",
                            "payment_note_label": "Notes",
                            "payment_label_style": {
                                "font_size": 10
                            },
                            "payment_details_label": "Payment Details"
                        },
                        "shipping_method": {
                            "shipping_method_label": "Shipping Method:",
                            "shipping_method": estimate_form.shipping_method,
                            "shipping_method_label_style": {
                                "font_size": 9
                            }
                        },
                        "task_table": {
                            "task_header_tax": [{
                                "task_header_tax_name": "Tax",
                                "task_header_tax_id": "82A4E33B-9598-44BA-A9FF-AA6A77218C01"
                            }],
                            "task_quantity_label": "Quantity",
                            "sac_header": "SAC",
                            "task_rate_label": "Rate",

                            "task_data": estimate_form['task_name[]']
                                ? [estimate_form['task_name[]']]
                                    .flat()
                                    .map((name, i) => {
                                        if (name !== '') {
                                            return {
                                                task_name: name,
                                                task_project: '',
                                                task_unit: "",
                                                task_discount: "",
                                                task_used_tax: [{
                                                    tax_name: "GST",
                                                    tax_amount: (Number([estimate_form["task_rate[]"]].flat()[i]) * Number([estimate_form["tasktaxrate[]"]].flat()[i])) / 100 || '',
                                                    tax_rate: Number([estimate_form["tasktaxrate[]"]].flat()[i]) || '',
                                                    tax_types: "%",
                                                    tax_id: "82A4E33B-9598-44BA-A9FF-AA6A77218C01"
                                                }],

                                                // task-amount =dynamic.
                                                task_amount: (Number([estimate_form["task_rate[]"]].flat()[i]) + (Number([estimate_form["task_rate[]"]].flat()[i]) * Number([estimate_form["tasktaxrate[]"]].flat()[i])) / 100) * Number([estimate_form["task_quantity[]"]].flat()[i]) || '',
                                                task_rate: Number([estimate_form["task_rate[]"]].flat()[i]) || '',
                                                task_quantity: Number([estimate_form["task_quantity[]"]].flat()[i]) || '',
                                                sac_value: "",
                                                task_inline_note: [estimate_form["task_description[]"]].flat()[i] || "",
                                                task_inline_date: "",
                                                // task_tax_per_unit: Number([estimate_form["tasktaxrate[]"]].flat()[i]) || '',
                                                task_tax_per_unit: Number([estimate_form["tasktaxrate[]"]].flat()[i]) || '',

                                                task_tax_total: Number([estimate_form["tasktaxrate[]"]].flat()[i]) || ''
                                                // task_tax_total: 60000,
                                            };
                                        }
                                    })
                                    .filter(Boolean) //  removes undefined/null
                                : [],


                            "task_table_style": {
                                "font_size": 10
                            },
                            "task_name_label": "Services",
                            "task_amount_label": "Amount",
                            "task_discount_label": "Discount",
                            "task_inline_note_style": {
                                "font_size": 9
                            }
                        },
                        "company_detail_style": {
                            "font_size": 9
                        },
                        "state": estimate_form.business_state,
                        // shipping data.
                        "shipping_address": {
                            "shipping_address_customer": estimate_form.customer_detail,
                            "shipping_state": estimate_form.shipping_state,
                            "shipping_pin_code": estimate_form.shipping_zip_code,
                            "shipping_country": estimate_form.shipping_country,
                            "shipping_city": estimate_form.shipping_city,
                            "shipping_street_2": estimate_form.shipping_street_2,
                            "shipping_street_1": estimate_form.shipping_street_1,
                            "shipping_address_label_style": {
                                "font_size": 9
                            },
                            "shipping_address_label": "Ship To:"
                        },
                        // businessname
                        "company_name_title": estimate_form.business_name,
                        "product_table": {
                            "product_name_label": "Products",
                            "product_inline_note_style": {
                                "font_size": 9
                            },
                            "product_quantity_label": "Quantity",
                            "hsn_header": "HSN",
                            "product_amount_label": "Amount",
                            "product_serial_no_label": "Serial/IMEI",

                         
                            "product_data": (
                                estimate_form["product_name[]"]
                            )
                                ? (Array.isArray(estimate_form["product_name[]"])
                                    ? estimate_form["product_name[]"]
                                    : [estimate_form["product_name[]"]]
                                ).map((name, i) => {

                                    if (name !== '') {

                                        // ✅ FIXED ALL ARRAY FIELDS
                                        const quantityArr = Array.isArray(estimate_form["quantity[]"])
                                            ? estimate_form["quantity[]"]
                                            : [estimate_form["quantity[]"]];

                                        const totalArr = Array.isArray(estimate_form["product_total[]"])
                                            ? estimate_form["product_total[]"]
                                            : [estimate_form["product_total[]"]];

                                        const taxRateArr = Array.isArray(estimate_form["producttaxrate[]"])
                                            ? estimate_form["producttaxrate[]"]
                                            : [estimate_form["producttaxrate[]"]];

                                        const productIdArr = Array.isArray(estimate_form["product_id[]"])
                                            ? estimate_form["product_id[]"]
                                            : [estimate_form["product_id[]"]];

                                        const descArr = Array.isArray(estimate_form["product_description[]"])
                                            ? estimate_form["product_description[]"]
                                            : [estimate_form["product_description[]"]];

                                        const taxNameArr = Array.isArray(estimate_form["producttaxname[]"])
                                            ? estimate_form["producttaxname[]"]
                                            : [estimate_form["producttaxname[]"]];

                                        const qty = Number(quantityArr[i] || 0);

                                        const total = Number(totalArr[i] || 0);

                                        const taxRate = Number(taxRateArr[i] || 0);

                                        const taxTotal = (total * taxRate) / 100;

                                        const itemCode = productIdArr[i] || "";

                                        const description = descArr[i] || "";

                                        const unitPrice = qty > 0
                                            ? (total / qty).toFixed(2)
                                            : "0.00";

                                        return {
                                            "product_name": name,
                                            "product_item_code": itemCode,
                                            "hsn_value": "",
                                            "serial_no_value": "",
                                            "product_quantity": qty.toString(),
                                            "product_unit": "",
                                            "product_unitprice": unitPrice,
                                            "product_discount": "",
                                            "product_image": "",

                                            "product_used_tax": [{
                                                "tax_name": taxNameArr[i] || "TAX",
                                                "tax_amount": taxTotal,
                                                "tax_id": "82A4E33B-9598-44BA-A9FF-AA6A77218C01",
                                                "tax_rate": taxRate,
                                                "tax_types": "%"
                                            }],

                                            "product_amount": (total + taxTotal).toString(),
                                            "product_with_tax_amount": (total + taxTotal).toString(),
                                            "product_without_tax_amount": total.toString(),
                                            "product_inline_note": description,
                                            "product_tax_per_unit": null,
                                            "product_tax_total": taxTotal
                                        };
                                    }

                                }).filter(Boolean)
                                : [],
                            "product_unitprice_label": "Unit Price",
                            "product_discount_label": "Discount",
                            "variant_size_header": "Variant Size",
                            "variant_type_header": "Variant Type",
                            "product_table_style": {
                                "font_size": 10
                            },
                            "product_header_tax": [{
                                "product_header_tax_name": "Tax",
                                "product_header_tax_id": "82A4E33B-9598-44BA-A9FF-AA6A77218C01"
                            }]

                        },
                        "website": "",
                        "sub_title": {
                            "sub_title_style": {
                                "font_size": 10
                            },
                            "sub_title_label": estimate_form.billing_sub_title
                        },
                        "table_cal": {
                            "qty_label": "Qty",
                            "deposit_label": "Deposit",
                            "amountpaid_value": '',
                            "task_quantity_label": "Quantity",
                            "total_cost_label": "Total",
                            "amountdue_label": "Amount Due",
                            "depositdue_label": "Deposit Due",
                            "total_inlinediscount_value": '',
                            "discount_value": 0,
                            "shipping_cost_value": `${estimate_form.shipping_cost ?? 0}`,
                            "rounded_total_label": "Rounded Total",
                            "rounded_total_remain_label": "Round Off",
                            "rounded_amount": 0,
                            "sub_total_value": `${estimate_form["sub_total[]"] ?? 0}`,
                            "deposit_ratio": "20",
                            "discount_ratio": "10.0000%",
                            "amountdue_value": '',
                            "discount_on_value": `${estimate_form["total_with_tax_and_price[]"] ?? 0}`,
                            "discount_on_header": "on",
                            "depositdue_value": 0,
                            "deposit_value": 0,
                            "amountpaid_label": "Amount Paid",
                            "single_total_label": "Total Quantity",
                            "return_order_label": "Return Order",
                            "return_order_value": '',
                            "table_cal_style": {
                                "font_size": 9
                            },
                            "sub_total_label": "Sub Total",
                            "total_inlinediscount_label": "Inline Discount",
                           
                            "tax_detail": (() => {

                                const groupedTaxes = {};

                                // =========================
                                // PRODUCT TAXES
                                // =========================
                                (Array.isArray(estimate_form["producttaxname[]"])
                                    ? estimate_form["producttaxname[]"]
                                    : [estimate_form["producttaxname[]"]]
                                )
                                    .forEach((name, i) => {

                                        if (!name || String(name).trim() === "") return;

                                        const productTaxRateArr = Array.isArray(estimate_form["producttaxrate[]"])
                                            ? estimate_form["producttaxrate[]"]
                                            : [estimate_form["producttaxrate[]"]];

                                        const rateArr = Array.isArray(estimate_form["rate[]"])
                                            ? estimate_form["rate[]"]
                                            : [estimate_form["rate[]"]];

                                        const quantityArr = Array.isArray(estimate_form["quantity[]"])
                                            ? estimate_form["quantity[]"]
                                            : [estimate_form["quantity[]"]];

                                        const rawRate = productTaxRateArr[i] || "0%";

                                        const ratePercentage = parseFloat(rawRate);

                                        const unitprice =
                                            (Number(rateArr[i] || 0) *
                                                Number(quantityArr[i] || 1));

                                        const taxValue = (unitprice * ratePercentage) / 100;

                                        window.totaltaxamount += taxValue;

                                        // ✅ UNIQUE KEY
                                        const taxKey = `${name}_${ratePercentage}`;

                                        // ✅ IF SAME TAX EXISTS => ADD VALUES
                                        if (groupedTaxes[taxKey]) {

                                            groupedTaxes[taxKey].tax_value =
                                                String(
                                                    Number(groupedTaxes[taxKey].tax_value) + taxValue
                                                );

                                            groupedTaxes[taxKey].tax_on_value =
                                                String(
                                                    Number(groupedTaxes[taxKey].tax_on_value) + unitprice
                                                );

                                        } else {

                                            groupedTaxes[taxKey] = {
                                                "tax_id": '',
                                                "tax_name": name,
                                                "tax_data": `${ratePercentage}%`,
                                                "tax_value": String(taxValue),
                                                "tax_on_header": "on",
                                                "tax_on_value": String(unitprice)
                                            };

                                        }

                                    });

                                // =========================
                                // TASK / SERVICE TAXES
                                // =========================
                                (Array.isArray(estimate_form["tasktaxname[]"])
                                    ? estimate_form["tasktaxname[]"]
                                    : [estimate_form["tasktaxname[]"]]
                                )
                                    .forEach((name, i) => {

                                        if (!name || String(name).trim() === "") return;

                                        const taskTaxRateArr = Array.isArray(estimate_form["tasktaxrate[]"])
                                            ? estimate_form["tasktaxrate[]"]
                                            : [estimate_form["tasktaxrate[]"]];

                                        const taskRateArr = Array.isArray(estimate_form["task_rate[]"])
                                            ? estimate_form["task_rate[]"]
                                            : [estimate_form["task_rate[]"]];

                                        const taskQtyArr = Array.isArray(estimate_form["task_quantity[]"])
                                            ? estimate_form["task_quantity[]"]
                                            : [estimate_form["task_quantity[]"]];

                                        const rawRate = taskTaxRateArr[i] || "0%";

                                        const ratePercentage = parseFloat(rawRate);

                                        const unitprice =
                                            (Number(taskRateArr[i]) *
                                                Number(taskQtyArr[i] || 1));

                                        const taxValue = (unitprice * ratePercentage) / 100;

                                        window.totaltaxamount += taxValue;

                                        // ✅ UNIQUE KEY
                                        const taxKey = `${name}_${ratePercentage}`;

                                        // ✅ IF SAME TAX EXISTS => ADD VALUES
                                        if (groupedTaxes[taxKey]) {

                                            groupedTaxes[taxKey].tax_value =
                                                String(
                                                    Number(groupedTaxes[taxKey].tax_value) + taxValue
                                                );

                                            groupedTaxes[taxKey].tax_on_value =
                                                String(
                                                    Number(groupedTaxes[taxKey].tax_on_value) + unitprice
                                                );

                                        } else {

                                            groupedTaxes[taxKey] = {
                                                "tax_id": '',
                                                "tax_name": name,
                                                "tax_data": `${ratePercentage}%`,
                                                "tax_value": String(taxValue),
                                                "tax_on_header": "on",
                                                "tax_on_value": String(unitprice)
                                            };

                                        }

                                    });

                                // ✅ RETURN FINAL ARRAY
                                return Object.values(groupedTaxes);

                            })(),

                            "discount_label": "Discount",
                            "total_cost_value": estimate_form["sub_amout_due[]"],
                            "shipping_cost_label": "Shipping Cost"
                        },
                        "invoice_report_title": page_name,
                        "terms_condition": {
                            "terms_condition_label_style": {
                                "font_size": 10
                            },
                            "terms_condition_label": "Terms & Conditions",
                            "terms_condition_value_style": {
                                "font_size": 9
                            },
                            "terms_condition": estimate_form.terms_codition
                        },
                        "mindecimaldigit": 2,
                        "background_image_height": 0,
                        "background_image": "https://www.mooninvoice.com/public/pdf_template/default.png",
                        "maxdecimaldigit": 2,
                        "street_1": estimate_form.business_address,
                        "street_2": "",
                        "Signature": {
                            "Signature_2_image": "",
                            "Signature_1_image": "",
                            "Signature_2_alignment": "2",
                            "Signature_1_alignment": "0",
                            "Signature_2_title": "",
                            "Signature_1_title": "",
                            "physical_sign_1_name": "",
                            "physical_sign_2_name": "",
                            "Signature_1_date": "",
                            "Signature_2_name": "",
                            "Signature_2_date": "",
                            "Signature_1_name": "",
                            "Signature_width": 100,
                            "Signature_height": 100,
                            "Signature_size": "Small"
                        },
                        "invoice_report_title_style": {
                            "font_size": 18
                        },
                        "vat_no": "",
                        "company_fax_no": "",
                        "hsn_sac_table": {
                            "hsnsac_label": "",
                            "taxable_value_label": "",
                            "central_tax_label": "",
                            "state_tax_label": "x",
                            "rate_label": "",
                            "amount_label": "",
                            "hsnsac_label_style": {
                                "font_size": 9
                            },
                            "total_tax_amount_label": "",
                            "hsnsac_data": [{
                                "hsnsac_value": "1115542",
                                "taxable_value_value": 100,
                                "s_rate_value": "9%",
                                "s_amount_value": 9,
                                "c_rate_value": "",
                                "c_amount_value": "",
                                "total_tax_amount_value": 9
                            }],
                            "total_label": "Total",
                            "total_tax": 9,
                            "total_c_tax": 0,
                            "total_s_tax": 9,
                            "total_taxable": 100
                        },
                        "qr_code": "",
                        "Signature_width": 100,
                        "Signature_height": 100,
                        "Signature_size": "Small"
                    },
                    "service_type": estimate_form.service_type,
                    "platform": "web",
                    "Scalling": "2",
                    "Horizontal": "2",
                    "Vertical": "2"
                }

                // console.log(estimate_form.customer_due_date);

                // console.log(data);

                const jsonString = JSON.stringify(data);

                // convert json to base64 safely without spread operator.
                const utf8Bytes = new TextEncoder().encode(jsonString);
                let binaryString = "";
                for (let i = 0; i < utf8Bytes.length; i++) {
                    binaryString += String.fromCharCode(utf8Bytes[i]);
                }
                const base64Data = btoa(binaryString);
                console.log("Base64 string generated safely.");
                // const parse_data = JSON.parse(localStorage.getItem('estimate_form'));


                // we have base64 now we have to call only nodepdfpreview api with this base64 data.
                fetch("https://betaapp.mooninvoice.com/live_webapp/node_pdf_preivew", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "is_json_type": true,
                        "json_Data": base64Data
                    })
                })
                    // error comes here,... 
                    // .then(res => res.json()) // 1. Read the response as JSON text
                    .then(res => {
                        if (isInstantSaveCancelled) throw new Error("cancelled");
                        if (!res.ok) throw new Error("Network response was not ok");
                        return res.json(); // Correctly returning the promise
                    })
                    .then(response => {
                        if (isInstantSaveCancelled) return;
                        // 2. Extract the Base64 string from the "base" key
                        // We split at the comma to remove "data:application/pdf;base64,"
                        console.log(response);


                        // Check if the server actually returned the PDF data
                        if (response.data && response.data.base) {
                            const base64String = response.data.base.split(',')[1];



                            // 3. Convert that Base64 string into a binary Blob
                            const byteCharacters = atob(base64String);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const pdfBlob = new Blob([byteArray], {
                                type: 'application/pdf'
                            });

                            // 4. Create a local URL for the PDF
                            const pdfUrl = URL.createObjectURL(pdfBlob);

                            if (isInstantSaveCancelled) return;
                            openPreview(pdfUrl);
                            window.pdfContent = pdfUrl;


                        } else {
                            // This handles your "Invoice not found" case
                            console.error("API Error Message:", response.message);
                            alert("Error: " + response.message);
                        }

                    })
                    .catch(err => {
                        if (err.message === "cancelled") return;
                        console.error("Failed to process PDF:", err);
                        alert("Could not generate PDF. Check console for details.");
                    });


            }
            else {
                $link.removeClass('is-loading').css({
                    'pointer-events': 'auto',
                    'opacity': '1'
                });
                unlockInvTplScroll();
            }
        }
        catch (error) {
            console.error("submission failed error:", error);
            $link.removeClass('is-loading').css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
            unlockInvTplScroll();
        }



    });
    // */



    $(".add_product").on('click', function (e) {
        e.preventDefault();
        counter++;
        table_tr++;


        let text_box = '<tr class="instant_invoice_detail remove_row" id="delete_item_' + counter +
            '"><input type="hidden" name="product_id["' + (counter) +
            '"]"><td class="color_black product_count">' + (table_tr) +
            '</td><td><div><span class="color_black mb_2"><input type="text" placeholder="Product" name="product_name[]" maxlength="255" data-value="" class="w-100 product_name input-px-10"></span><span class="color_light"><textarea name="product_description[]" id="" placeholder="Description" class="w-100 product_description input-px-10" cols="85" rows="2"></textarea></span></div></td>' +

            '<td class="color_light text_right"><input type="number" placeholder="Quantity" data-value="1" data-action="productQuantity" name="quantity[]" id="product_quantity_' +
            counter + '" for="' + counter +
            '" value="1" min="1" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="5" class="max_70 product_quantity"></td>' +

            '<td class="color_light text_right"><input type="number" placeholder="Rate" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="10" for="' +
            counter + '" name="rate[]" id="product_price_' + counter +
            '" min="0" data-action="productRate" data-value="" class="max_70 product_price"></td>' +

            // ✅ Added GST Name
            '<td class="color_light text_right">' +
            '<input type="text" placeholder="GST" name="producttaxname[]" id="product_tax_name_' +
            counter +
            '" maxlength="255" data-action="productTaxName" data-value="" class="max_70 product_tax_name">' +
            '</td>' +

            // ✅ Added Tax Rate
            '<td class="color_light text_right">' +
            '<input type="number" placeholder="Tax%" maxlength="10" for="' + counter +
            '" name="producttaxrate[]" id="product_tax_rate_' + counter +
            '" min="0" data-action="productTaxRate" data-value="" ' +
            'oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" ' +
            'class="max_70 product_tax_rate">' +
            '</td>' +

            '<td class="color_light text_right"><span class="add_symbol"></span> ' +
            '<span class="max_70 product_total" id="product_total_' +
            counter + '">0</span>' +

            '<a href="javascript:void(0);" for="' + counter +
            '" id="item_remove" class="delete_item">' +
            '<span class="fa fa-trash"></span></a>' +

            '<input type="hidden" name="product_total[]" class="product_total1_' +
            counter + '" id="product_total1_' + counter +
            '" value="" data-value="">' +

            '</td></tr>';

        $('#invoice_list').append(text_box);
        if (default_currecy != '') {
            $('.add_symbol').text($("#customer_currency").find(':selected').data('symbol'));
        } else {
            // console.log('default22:' + default_currecy);
        }
        return false;
    });


    $(".add_task").on('click', function (e) {
        e.preventDefault();
        counter++;
        table_tr++;

        // Backup task description
        // <input type="text" placeholder="Description" maxlength="255" data-value="" onkeypress="return /^[a-zA-Z0-9 ]+$/i.test(event.key)" name="task_description[]" class="w-100 task_description">
        let text_box = '<tr class="instant_invoice_detail remove_row" id="delete_item_' + counter +
            '"><input type="hidden" name="product_id["' + (counter) +
            '"]"><td class="color_black product_count">' + (table_tr) +
            '</td><td><div><span class="color_black mb_2"><input type="text" placeholder="Task" name="task_name[]" maxlength="255" data-value="" class="w-100 task_name input-px-10"></span><span class="color_light"><textarea name="task_description[]" placeholder="Description" class="w-100 task_description input-px-10" cols="85" rows="2"></textarea></span></div></td>' +

            '<td class="color_light text_right"><input type="number" placeholder="Quantity" data-value="1" data-action="productQuantity" name="task_quantity[]" for="' +
            counter + '" id="task_quantity_' + counter +
            '" value="1" min="1" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="5" class="max_70 task_quantity"></td>' +

            '<td class="color_light text_right"><input type="number" for="' +
            counter + '" id="task_price_' + counter +
            '" placeholder="Rate" name="task_rate[]" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="10" min="0" data-value="" data-action="productRate" value="" class="max_70 task_price"></td>' +

            // ✅ Added GST Name
            '<td class="color_light text_right">' +
            '<input type="text" placeholder="GST" name="tasktaxname[]" id="task_tax_name_' +
            counter +
            '" maxlength="255" data-action="taskTaxName" data-value="" class="max_70 task_tax_name">' +
            '</td>' +

            // ✅ Added Tax %
            '<td class="color_light text_right">' +
            '<input type="number" placeholder="Tax%" maxlength="10" for="' + counter +
            '" name="tasktaxrate[]" id="task_tax_rate_' + counter +
            '" min="0" data-action="taskTaxRate" data-value="" ' +
            'oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" ' +
            'class="max_70 task_tax_rate">' +
            '</td>' +

            '<td class="color_light text_right"><span class="add_symbol"></span> ' +
            '<span class="max_70 task_total_' +
            counter + ' product_total" id="product_total_' + counter +
            '">0</span>' +

            '<a href="javascript:void(0);" for="' + counter +
            '" id="item_remove" class="delete_item"><span class="fa fa-trash"></span></a>' +

            '<input type="hidden" name="task_total[]" class="task_total1_' +
            counter + '" value="" data-value="">' +

            '</td></tr>';

        $("#invoice_list").append(text_box);
        if (default_currecy != '') {
            $('.add_symbol').text($("#customer_currency").find(':selected').data('symbol'));
        } else {
            $('.add_symbol').html("$");
        }
        return false;
    });

    check = function (e, value) {
        if (!e.target.validity.valid) {
            e.target.value = value.substring(0, value.length - 1);
            return false;
        }
        var idx = value.indexOf('.');
        if (idx >= 0) {
            if (value.length - idx > 3) {
                e.target.value = value.substring(0, value.length - 1);
                return false;
            }
        }
        return true;
    }
});



$("#invoice_signup_form").on('input',
    'input.product_price,input.product_quantity,input.product_tax_rate,input.product_tax_name,input.task_tax_rate,input.task_tax_name,input.shipping_cost,input.single_tax,input.task_quantity,input.task_price',
    function (e) {
        e.stopPropagation();
        getTotalCost($(this).attr("for"));
    });

let price_n = '';
let tax_n = '';

function getNum(val) {
    val = parseFloat(val);
    return isNaN(val) ? 0 : val;
}

function getTotalCost(ind) {
    /* ---------- PRODUCT ---------- */

    var qty = getNum($('#product_quantity_' + ind).val());
    var price = getNum($('#product_price_' + ind).val());

    var baseProductTotal = qty * price;

    var productTaxName = $("#product_tax_name_" + ind).val();
    var productTaxRate = getNum($("#product_tax_rate_" + ind).val());

    var productTaxAmount = 0;

    if (productTaxName && productTaxRate > 0) {
        productTaxAmount = (baseProductTotal * productTaxRate) / 100;
    }

    var finalProductTotal = baseProductTotal + productTaxAmount;

    $('#product_total_' + ind).html(finalProductTotal.toFixed(2));
    $(".product_total1_" + ind).val(finalProductTotal);


    /* ---------- TASK ---------- */

    var taskQty = getNum($("#task_quantity_" + ind).val());
    var taskPrice = getNum($("#task_price_" + ind).val());

    var baseTaskTotal = taskQty * taskPrice;

    var taskTaxName = $("#task_tax_name_" + ind).val();
    var taskTaxRate = getNum($("#task_tax_rate_" + ind).val());

    var taskTaxAmount = 0;

    if (taskTaxName && taskTaxRate > 0) {
        taskTaxAmount = (baseTaskTotal * taskTaxRate) / 100;
    }

    var finalTaskTotal = baseTaskTotal + taskTaxAmount;

    $(".task_total_" + ind).html(finalTaskTotal.toFixed(2));
    $(".task_total1_" + ind).val(finalTaskTotal);


    /* ---------- SUBTOTAL (WITHOUT TAX) ---------- */

    var subtotal = 0;

    $(".product_price").each(function () {
        var row = $(this).attr("for");

        subtotal +=
            getNum($("#product_quantity_" + row).val()) *
            getNum($("#product_price_" + row).val());
    });

    $(".task_price").each(function () {
        var row = $(this).attr("for");

        subtotal +=
            getNum($("#task_quantity_" + row).val()) *
            getNum($("#task_price_" + row).val());
    });

    $('.sub_total').html(subtotal.toFixed(2));
    $('.sub_total1').val(subtotal);


    /* ---------- TOTAL TAX ---------- */

    var totalTax = 0;


    // PRODUCT TAX LOOP
    $(".product_tax_rate").each(function () {
        var row = $(this).attr("for");

        var taxName = $("#product_tax_name_" + row).val();
        var taxRate = getNum($(this).val());

        if (taxName && taxRate > 0) {
            var base =
                getNum($("#product_quantity_" + row).val()) *
                getNum($("#product_price_" + row).val());

            totalTax += (base * taxRate) / 100;
        }
    });


    // TASK TAX LOOP
    $(".task_tax_rate").each(function () {
        var row = $(this).attr("for");

        var taxName = $("#task_tax_name_" + row).val();
        var taxRate = getNum($(this).val());

        if (taxName && taxRate > 0) {
            var base =
                getNum($("#task_quantity_" + row).val()) *
                getNum($("#task_price_" + row).val());

            totalTax += (base * taxRate) / 100;
        }
    });


    /* ---------- TAX BREAKDOWN UI ---------- */

    $(".tax_breakdown_row").remove();


    // remove old rows first
    $(".tax_breakdown_row").remove();

    var taxSummary = {};
    var currencySymbol = $("#customer_currency").find(':selected').data('symbol');

    // helper function to process tax rows
    function processTax(selector, type) {
        $(selector).each(function () {
            var row = $(this).attr("for");

            var taxName = $("#" + type + "_tax_name_" + row).val();
            var taxRate = getNum($(this).val());

            var base =
                getNum($("#" + type + "_quantity_" + row).val()) *
                getNum($("#" + type + "_price_" + row).val());

            if (taxName && taxRate > 0 && base > 0) {
                var taxAmount = (base * taxRate) / 100;

                var key = taxName + "_" + taxRate;

                if (!taxSummary[key]) {
                    taxSummary[key] = {
                        taxName: taxName,
                        taxRate: taxRate,
                        base: 0,
                        taxAmount: 0
                    };
                }

                taxSummary[key].base += base;
                taxSummary[key].taxAmount += taxAmount;
            }
        });
    }

    // process both
    processTax(".product_tax_rate", "product");
    processTax(".task_tax_rate", "task");

    // render merged result
    $.each(taxSummary, function (key, tax) {
        $(".new_subtotal_div").after(`
                        <div class="d-flex flex_wrap flex_between wrap_div tax_breakdown_row">
                            <span class="color_primary_new font_14">
                                ${tax.taxRate}% ${tax.taxName} on 
                                <span class="add_symbol">${currencySymbol}</span>${tax.base.toFixed(2)}
                            </span>
                            <span class="color_primary_new font_14">
                                <span class="add_symbol">${currencySymbol}</span>${tax.taxAmount.toFixed(2)}
                            </span>
                        </div>
                    `);
    });

    /* ---------- UPDATE TAX ---------- */

    $(".inline_taxes").html(totalTax.toFixed(2));
    $(".inline_taxes1").val(totalTax);


    /* ---------- FINAL TOTAL ---------- */

    var shipping_cost = getNum($("#shipping_cost").val());

    $('.shipping_cost_label').html(shipping_cost.toFixed(2));
    $('.shipping_cost_label1').val(shipping_cost);

    var finalTotal = subtotal + totalTax + shipping_cost;

    $('.total_with_tax_and_price').html(finalTotal.toFixed(2));
    $('.total_with_tax_and_price1').val(finalTotal);

    $('.sub_amout_due').html(finalTotal.toFixed(2));
    $('.sub_amout_due1').val(finalTotal);
}



// Business Address
$('.same_as_billing_address').on('click', function (e) {

    var chk = e.target.checked;
    if (chk == true) {
        $("#shipping_address").val($("#biling_address").val());
        $("#shipping_street_1").val($("#billing_street_1").val());
        $("#shipping_street_2").val($("#billing_street_2").val());
        $("#shipping_city").val($("#billing_city").val());
        $("#shipping_state").val($("#billing_state").val());
        $("#shipping_zip_code").val($("#billing_zip_code").val());
        $("#shipping_country").val($("#billing_country").val());
    } else {
        $("#shipping_address").val("");
        $("#shipping_street_1").val("");
        $("#shipping_street_2").val("");
        $("#shipping_city").val("");
        $("#shipping_state").val("");
        $("#shipping_zip_code").val("");
        $("#shipping_country").val("");
    }
});

// $("#invoice_email").on('click', function () {
//     // $("#uniquePreviewBackdrop").first().trigger('click');
//     // openPreview("http://miwebsite.localhost.com/resources/js/Invoice.pdf");

// });
// window.onload = function () { }





// ---------------------------------------------------------------
// model preview and print pdf .....
// ---------------------------------------------------------------

/*
    function openPreview(pdfUrl) {
        // currentPdfUrl = pdfUrl;

        const backdrop = document.getElementById('uniquePreviewBackdrop');
        const loader = document.getElementById('previewLoadingOverlay');

        // Ensure modal is visible and loader is shown
        if (backdrop) backdrop.style.display = 'flex';
        if (loader) loader.classList.remove('preview-hidden');

        const pdfjsLib = window['pdfjsLib'];
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            pdf.getPage(1).then(page => {

                const canvas = document.getElementById('pdfCanvas');
                const context = canvas.getContext('2d');
                const container = document.querySelector('.pdf-scroll-container');

                const viewport = page.getViewport({
                    scale: 1
                });

                const scale = container.clientWidth / viewport.width;
                const scaledViewport = page.getViewport({
                    scale
                });

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;

                page.render({
                    canvasContext: context,
                    viewport: scaledViewport
                }).promise.then(() => {
                    // ✅ Rendering Complete: Hide Loader
                    const loader = document.getElementById('previewLoadingOverlay');
                    if (loader) loader.classList.add('preview-hidden');
                });
            });
        });
    }
*/




async function openPreview(pdfUrl) {

    const container = document.querySelector('.pdf-scroll-container');
    if (!container) return;

    // Clear existing preview
    container.innerHTML = '';

    // Show backdrop/loader
    document.getElementById('uniquePreviewBackdrop').style.display = 'flex';
    const loader = document.getElementById('previewLoadingOverlay');
    if (loader) loader.classList.remove('preview-hidden');

    const pdfjsLib = window['pdfjsLib'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Disable print/download/watermark while loading (redundant but safe)
    $("#download-modal-trigger, #print-modal-trigger, .remove_watermark").css({
        'pointer-events': 'none',
        'opacity': '0.5'
    });

    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        if (isInstantSaveCancelled) return;

        // Loop through all pages to show multi-page PDFs
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            if (isInstantSaveCancelled) return;
            const page = await pdf.getPage(pageNum);

            // --- OPTIMIZED RENDERING FOR MOBILE ---
            // Limit DPR to 2.0 to prevent memory crashes on high-res mobile devices
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const originalViewport = page.getViewport({ scale: 1 });

            // Calculate scale based on container width
            const containerWidth = container.clientWidth - 40; // Subtract padding/margin
            const scale = containerWidth / originalViewport.width;
            const viewport = page.getViewport({ scale: scale * dpr });

            // Create and setup canvas for each page
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-canvas';
            canvas.style.display = 'block';
            canvas.style.margin = '10px auto';
            canvas.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';

            const context = canvas.getContext('2d', { alpha: false });

            // Set actual resolution (High-Res but clamped)
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Set display size (Matches Screen)
            canvas.style.width = containerWidth + "px";
            canvas.style.height = "auto";

            container.appendChild(canvas);

            await page.render({
                canvasContext: context,
                viewport: viewport,
                intent: 'display'
            }).promise;
        }

        if (loader) loader.classList.add('preview-hidden');

        // Enable print/download/watermark after loading completely
        $("#download-modal-trigger, #print-modal-trigger, .remove_watermark").css({
            'pointer-events': 'auto',
            'opacity': '1'
        });

    } catch (err) {
        console.error("Render error:", err);
        if (loader) loader.classList.add('preview-hidden');
        document.getElementById('uniquePreviewBackdrop').style.display = 'none';

        // Enable print/download/watermark on error
        $("#download-modal-trigger, #print-modal-trigger, .remove_watermark").css({
            'pointer-events': 'auto',
            'opacity': '1'
        });

        alert("Could not load PDF. Please try again.");
    }
}

function closePreview() {

    isInstantSaveCancelled = true;

    // Enable print/download/watermark for next time
    $("#download-modal-trigger, #print-modal-trigger, .remove_watermark").css({
        'pointer-events': 'auto',
        'opacity': '1'
    });


    const backdrop = document.getElementById('uniquePreviewBackdrop');
    if (backdrop) backdrop.style.display = 'none';

    unlockInvTplScroll();

    // Reset loader for next time
    const loader = document.getElementById('previewLoadingOverlay');
    if (loader) loader.classList.remove('preview-hidden');

    // Clear canvases to free memory immediately
    const container = document.querySelector('.pdf-scroll-container');
    if (container) container.innerHTML = '';

    // Enable the save button if it was in loading state
    if ($("#instantSaveBtn").hasClass('is-loading')) {
        $("#instantSaveBtn").removeClass('is-loading').css({
            'pointer-events': 'auto',
            'opacity': '1'
        });
    }
}

function printPDF() {
    const container = document.querySelector('.pdf-scroll-container');
    const canvases = container ? container.querySelectorAll('canvas') : [];

    if (canvases.length === 0) {
        console.error("No pages found to print");
        return;
    }

    // Create a hidden iframe for printing
    let printFrame = document.getElementById('print-helper-frame');
    if (printFrame) {
        printFrame.remove();
    }

    printFrame = document.createElement('iframe');
    printFrame.id = 'print-helper-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write('<html><head><title>Print PDF</title>');
    // Style for multi-page print layout
    doc.write('<style>body{margin:0;padding:0;} img{display:block;width:100%;page-break-after:always;} img:last-child{page-break-after:avoid;}</style>');
    doc.write('</head><body>');

    canvases.forEach((canvas) => {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        doc.write(`<img src="${dataUrl}" />`);
    });

    doc.write('</body></html>');
    doc.close();

    // Trigger print
    printFrame.contentWindow.focus();
    setTimeout(() => {
        printFrame.contentWindow.print();
        // Remove frame after a delay to allow print dialog to initialize
        setTimeout(() => {
            if (printFrame.parentNode) {
                printFrame.parentNode.removeChild(printFrame);
            }
        }, 1000);
    }, 500);
}




//-------------------------------------------------
// download and print pdf code..
//-------------------------------------------------
function validateField(field) {
    let isValid = true;

    if (field === 'name' || field === 'all') {
        const name = $('#name').val().trim();
        const $group = $('#nameGroup');
        if (!name) {
            $group.addClass('error');
            isValid = false;
        } else {
            $group.removeClass('error');
        }
    }

    if (field === 'email' || field === 'all') {
        const email = $('#email').val().trim();
        const $group = $('#emailGroup');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            $group.addClass('error');
            $group.find('.login-error-message').text('Email is required.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $group.addClass('error');
            $group.find('.login-error-message').text('Please enter a valid email.');
            isValid = false;
        } else {
            $group.removeClass('error');
        }
    }

    if (field === 'phone' || field === 'all') {
        const phone = $('#phone').val().trim();
        const $group = $('#phoneGroup');
        if (!phone) {
            $group.addClass('error');
            isValid = false;
        } else {
            $group.removeClass('error');
        }
    }

    if (field === 'jobRole' || field === 'all') {
        const jobRole = $('#jobRoleValue').text().trim();
        const $group = $('#jobRoleGroup');
        if (!jobRole) {
            $group.addClass('error');
            isValid = false;
        } else {
            $group.removeClass('error');
        }
    }

    return isValid;
}

$(document).ready(function () {
    // Remove default error classes on page load
    $('.login-input-groups.error, .download-modal-field.error').removeClass('error');

    // Attach blur events
    $('#name').on('blur', function () {
        validateField('name');
    });

    // Job Role Selection Handler
    $('.download-modal-option').on('click', function () {
        const val = $(this).data('value');
        const text = $(this).text();
        $('#jobRoleValue').text(text);
        $('#jobRoleInput').val(val);
        $('#jobRolePanel').hide();
        validateField('jobRole');
    });

    $('#jobRoleTrigger').on('click', function (e) {
        e.stopPropagation();
        $('#jobRolePanel').toggle();
    });

    $(document).on('click', function () {
        $('#jobRolePanel').hide();
    });


    // Handle submission
    $('#downloadForm').on('submit', function (e) {
        e.preventDefault();

        const $btn = $('#downloadModalBtn');
        const action = $btn.attr('data-action');

        if (validateField('all')) {
            const originalText = $btn.text();
            $btn.text('Processing...').prop('disabled', true);

            const formData = {
                name: $('#name').val().trim(),
                email: $('#email').val().trim(),
                phone: $('#phone').val().trim(),
                designation: $('#jobRoleValue').text().trim(),
                medium: "{{ $page_name }}"
            };

            const jsonString = JSON.stringify(formData);
            const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
            $('#encoded_data').val(base64Data);

            $.ajax({
                url: $(this).attr('action'),
                type: "POST",
                data: {
                    _token: "{{ csrf_token() }}",
                    request: $('#encoded_data').val()
                },
                success: function (response) {
                    $btn.text(originalText).prop('disabled', false);

                    let res = typeof response === 'string' ? JSON.parse(response) :
                        response;

                    if (res.status == 200) {
                        // Set submission flags
                        localStorage.setItem('user_submit', 'true');
                        window.user_submitted = true;

                        // Close modal
                        $('.download-modal-overlay').removeClass('active');
                        $('body').css({
                            overflow: '',
                            paddingRight: ''
                        });

                        // Perform the document action (using centralized function in freetoolsave.js)
                        if (typeof performDocumentAction === 'function') {
                            performDocumentAction(action);
                        }
                    } else {
                        alert(res.message ||
                            'Validation failed. Please check your inputs.');
                    }

                },
                error: function (xhr) {
                    $btn.text(originalText).prop('disabled', false);
                    console.error('Error submitting form data:', xhr.responseText);
                    alert('Something went wrong. Please try again.');
                }
            });
        }
    });

});


//---------------------------------------------------------
// code for template select.
//---------------------------------------------------------

// apply button.
$(document).on('click', '.invTpl-apply', function () {
    // Find the currently highlighted card
    const activeCardId = $('.invTpl-inner.active').attr('id');

    // Commit the value to the global variable based on the map
    if (activeCardId && TEMPLATE_MAP[activeCardId]) {
        template_design = TEMPLATE_MAP[activeCardId];
    }

    console.log("Template Applied Successfully:", template_design);

    // Optional: Close the modal after applying
    invTplClose();
});

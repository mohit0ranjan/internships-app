$(document).ready(function() {

    axios.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content')

    $(".select-technology").select2({
        tags: true,
        maximumSelectionLength: 1,
    });

    $(".select-Organization").select2({
        tags: true,
        maximumSelectionLength: 1,
    });
    $(".select-City").select2({
        tags: true,
        maximumSelectionLength: 1,
    });
    $(".select-State").select2({
        tags: true,
        maximumSelectionLength: 1,
    });

    $("#organisation").change(function() {
        var org_id = $("#organisation").val();
        // console.log(org_id);
        axios
            .post("/cms/find-center", {
                org_id: org_id,
            })
            .then((r) => {
                // console.log(r.data);

                var center = r.data.center;
                // console.log(center.length);
                // console.log(center);

                $("#center").find("option").remove();
                $("#center").append(
                    $("<option/>", {
                        value: "",
                        text: "Select Center",
                    })
                );

                for (var i = 0; i < center.length; i++) {
                    // console.log(center[i].name);
                    $("#center").append(
                        "<option value=" +
                        center[i].id +
                        ">" +
                        center[i].name +
                        "</option>"
                    );
                }
            });
    });

    // -------------slick-------------------//
    $(".my-slider").slick({
        centerMode: true,
        centerPadding: "0px",
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        speed: 300,
        infinite: true,
        autoplaySpeed: 5000,
        autoplay: true,
        variableWidth: true,
        responsive: [{
                breakpoint: 768,
                settings: {
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: false,
                    speed: 300,
                    infinite: true,
                    autoplaySpeed: 5000,
                    autoplay: false,
                    variableWidth: false,
                    // prevArrow: '<button class="slick_common_btn"><i class="fa fa-arrow-right"></i></button>',
                    // nextArrow: '<button class="slick_common_btn"><i class="fa fa-arrow-right"></i></button>'
                },
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 1,
                    variableWidth: false,
                },
            },
        ],
    });

    // twitter slider
    $(".twiter_slider").slick({
        centerMode: true,
        centerPadding: "0px",
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplaySpeed: 5000,
        autoplay: true,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    centerMode: true,
                    centerPadding: "5px",
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: false,
                    speed: 300,
                    infinite: true,
                    autoplaySpeed: 5000,
                    autoplay: false,
                    // prevArrow: '<button class="slick_common_btn"><i class="fa fa-arrow-right"></i></button>',
                    // nextArrow: '<button class="slick_common_btn"><i class="fa fa-arrow-right"></i></button>'
                },
            },
            // {
            //     breakpoint: 768,
            //     settings: {
            //         centerMode: true,
            //         centerPadding: '5px',
            //         slidesToShow: 2,
            //         slidesToScroll: 1,
            //         arrows: false,
            //         dots: false,
            //         speed: 300,
            //         infinite: true,
            //         autoplaySpeed: 5000,
            //         autoplay: true,
            //         // prevArrow: '<button class="slick_common_btn"><i class="fa fa-arrow-right"></i></button>',
            //         // nextArrow: '<button class="slick_common_btn"><i class="fa fa-arrow-right"></i></button>'
            //     }
            // },
            // {
            //     breakpoint: 600,
            //     settings: {
            //         slidesToShow: 1,
            //         slidesToScroll: 1,
            //         dots: false,
            //         arrows: false,
            //     }
            // },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 1,
                },
            },
        ],
    });
    // -------------slick ends-------------------//

    $("#selectOrg").on("change", function() {
        var org_id = $("#selectOrg option:selected").val();
        console.log(org_id);

        axios
            .post("/find-city", {
                org_id: org_id,
            })
            .then((r) => {
                console.log(r.data);

                var selectCity = r.data.selectCity;
                // console.log(selectCity.length);
                // console.log(selectCity);

                $("#selectCity").find("option").remove();
                $("#selectCity").append(
                    $("<option/>", {
                        value: "",
                        disabled: true,
                        text: "Select Center",
                    })
                );

                for (var i = 0; i < selectCity.length; i++) {
                    // console.log(selectCity[i].name);
                    $("#selectCity").append(
                        "<option value=" +
                        selectCity[i].id +
                        ">" +
                        selectCity[i].name +
                        "</option>"
                    );
                }
            });
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#imagePreview").css(
                    "background-image",
                    "url(" + e.target.result + ")"
                );
                $("#imagePreview").hide();
                $("#imagePreview").fadeIn(650);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function() {
        readURL(this);
    });

    //

    function readURL2(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#imagePreview2").css(
                    "background-image",
                    "url(" + e.target.result + ")"
                );
                $("#imagePreview2").hide();
                $("#imagePreview2").fadeIn(650);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload2").change(function() {
        readURL2(this);
    });

    //
    $("#passedout").on("click", function() {
        $("#passyeardiv").removeClass("d-none");
        $("#graduationPercentage").removeClass("d-none");
        $("#graduationDate").removeClass("d-none");
        $("#semesterdiv").addClass("d-none");
    });

    $("#pursuing").on("click", function() {
        $("#semesterdiv").removeClass("d-none");
        $("#graduationPercentage").removeClass("d-none");
        $("#graduationDate").removeClass("d-none");
        $("#passyeardiv").addClass("d-none");
    });

    $("#graduation_discipline").on("change", function() {
        var graduationDiscipline = $(this).find("option:selected").val();
        $("#semseter").prop("selectedIndex", -1).trigger("change");

        $("#semester option[value=0]").prop("selected", true);
        if (graduationDiscipline == 3 || graduationDiscipline == 4) {
            $("#semester option[value=1]").attr("disabled", "disabled");
            $("#semester option[value=2]").attr("disabled", "disabled");
            $("#semester option[value=3]").prop("disabled", false);
        } else {
            $("#semester option[value=1]").prop("disabled", false);
            $("#semester option[value=2]").prop("disabled", false);
            $("#semester option[value=3]").attr("disabled", "disabled");
        }
    });

    // Clear Form
    $("#clearform").on("click", function() {
        $("#enrollForm")[0].reset();
    });

    // Body Font Size Change
    $("#sizeUp").on("click", function() {
        var fontSize = parseInt($("body").css("font-size"));
        fontSize = fontSize + 1 + "px";
        $("body").css({
            "font-size": fontSize,
        });
    });

    $("#normal").on("click", function() {
        var fontSize = parseInt($("body").css("font-size"));
        fontSize = "14px";
        $("body").css({
            "font-size": fontSize,
        });
    });

    $("#sizeDown").on("click", function() {
        var fontSize = parseInt($("body").css("font-size"));
        fontSize = fontSize - 1 + "px";
        $("body").css({
            "font-size": fontSize,
        });
    });

    // Candidate confirmation for attendance form
    $('#confirm-candidate').on('click', function() {
        var candidateId = $('#candidate_id').val().trim();
        var errorDiv = $('#candidate-error');
        var infoDiv = $('#candidate-info');
        var orgNameSpan = $('#org-name');
        var centerNameSpan = $('#center-name');
        var orgIdInput = $('#org_id');
        var centerIdInput = $('#center_id');
        var punchInBtn = $('#punch-in-btn');
        var punchOutBtn = $('#punch-out-btn');
        var aicteIdSpan = $('#aicte-id');
        var candidateNameSpan = $('#candidate-name');

        errorDiv.hide();
        infoDiv.hide();
        punchInBtn.prop('disabled', true);
        punchOutBtn.prop('disabled', true);
        orgIdInput.val('');
        centerIdInput.val('');
        orgNameSpan.text('');
        centerNameSpan.text('');
        aicteIdSpan.text('');
        candidateNameSpan.text('');

        if (!candidateId) {
            errorDiv.text('Please enter a Candidate ID.').show();
            return;
        }

        axios.get('/api/candidate-info/' + encodeURIComponent(candidateId))
            .then(function(response) {
                var data = response.data;
                if (data.error) {
                    errorDiv.text(data.error).show();
                } else {
                    orgIdInput.val(data.org_id);
                    centerIdInput.val(data.center_id);
                    orgNameSpan.text(data.org_name);
                    centerNameSpan.text(data.center_name);
                    aicteIdSpan.text(data.aicte_id);
                    candidateNameSpan.text(data.candidate_name);
                    infoDiv.show();
                    punchInBtn.prop('disabled', false);
                    punchOutBtn.prop('disabled', false);
                }
            })
            .catch(function() {
                errorDiv.text('Error fetching candidate information.').show();
            });
    });

    // Attendance fingerprint logic
    $(function() {
        if ($('#attendance-form').length > 0) {
            // Helper to get center_id from URL
            function getCenterIdFromUrl() {
                var params = new URLSearchParams(window.location.search);
                return params.get('center_id');
            }
            // Wait for ClientJS to be loaded
            var waitForClientJS = function(callback) {
                if (typeof ClientJS !== 'undefined') {
                    callback();
                } else {
                    setTimeout(function() {
                        waitForClientJS(callback);
                    }, 100);
                }
            };
            waitForClientJS(function() {
                var client = new ClientJS();
                var fingerprint = client.getFingerprint();
                // Set fingerprint when candidate is confirmed
                $('#confirm-candidate').on('click', function() {
                    $('#fingerprint').val(fingerprint);
                });
                // Also set on form submit (in case user skips confirm)
                $('#attendance-form').on('submit', function() {
                    $('#fingerprint').val(fingerprint);
                });
            });

            // Update candidate info AJAX to include center_id
            $('#confirm-candidate').off('click').on('click', function() {
                var candidateId = $('#candidate_id').val().trim();
                var errorDiv = $('#candidate-error');
                var infoDiv = $('#candidate-info');
                var orgNameSpan = $('#org-name');
                var centerNameSpan = $('#center-name');
                var orgIdInput = $('#org_id');
                var centerIdInput = $('#center_id');
                var punchInBtn = $('#punch-in-btn');
                var punchOutBtn = $('#punch-out-btn');
                var aicteIdSpan = $('#aicte-id');
                var candidateNameSpan = $('#candidate-name');
                var centerIdParam = getCenterIdFromUrl();

                errorDiv.hide();
                infoDiv.hide();
                punchInBtn.prop('disabled', true);
                punchOutBtn.prop('disabled', true);
                orgIdInput.val('');
                centerIdInput.val('');
                orgNameSpan.text('');
                centerNameSpan.text('');
                aicteIdSpan.text('');
                candidateNameSpan.text('');

                if (!candidateId) {
                    errorDiv.text('Please enter a Candidate ID.').show();
                    return;
                }

                var url = '/api/candidate-info/' + encodeURIComponent(candidateId);
                if (centerIdParam) {
                    url += '?center_id=' + encodeURIComponent(centerIdParam);
                }
                axios.get(url)
                    .then(function(response) {
                        var data = response.data;
                        if (data.error) {
                            errorDiv.text(data.error).show();
                        } else {
                            orgIdInput.val(data.org_id);
                            centerIdInput.val(data.center_id);
                            orgNameSpan.text(data.org_name);
                            centerNameSpan.text(data.center_name);
                            aicteIdSpan.text(data.aicte_id);
                            candidateNameSpan.text(data.candidate_name);
                            infoDiv.show();
                            punchInBtn.prop('disabled', false);
                            punchOutBtn.prop('disabled', false);
                        }
                    })
                    .catch(function() {
                        errorDiv.text('Error fetching candidate information.').show();
                    });
            });
        }
    });
});
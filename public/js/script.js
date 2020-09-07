window.onload = function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    });
    $('#message').fadeTo(1000,1).fadeOut(3000);
}
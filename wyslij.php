<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $imie = htmlspecialchars($_POST['imie']);
    $nazwisko = htmlspecialchars($_POST['nazwisko']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $tresc = htmlspecialchars($_POST['tresc']);

    if ($imie && $nazwisko && $email && $tresc) {
        $to = "kontakt@klaudiagotuje.pl";
        $temat = "Wiadomość ze strony KlaudiaGotuje.pl";
        $wiadomosc = "Imię: $imie\nNazwisko: $nazwisko\nEmail: $email\n\nTreść:\n$tresc";

        $headers = "From: $email";

        if (mail($to, $temat, $wiadomosc, $headers)) {
            echo "Dziękujemy za wiadomość!";
        } else {
            echo "Wystąpił błąd podczas wysyłania.";
        }
    } else {
        echo "Wypełnij wszystkie pola poprawnie.";
    }
} else {
    echo "Nieprawidłowa metoda wysyłki.";
}
?>
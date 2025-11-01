<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

// 🔧 Dane połączenia z bazą
$servername = "n128.domenomania.pl";
$username = "dm73971_klaudiagotuje";
$password = "";
$dbname = "dm73971_Klaudia_gotuje_db";

// 🔌 Połączenie z bazą danych
$conn = new mysqli($servername, $username, $password, $dbname);

// 🧩 Sprawdzenie połączenia
if ($conn->connect_error) {
    die("<p>❌ Błąd połączenia z bazą: " . $conn->connect_error . "</p>");
}

// 🔍 Pobieranie wszystkich przepisów
$sql = "SELECT * FROM Przepisy WHERE PrzepisID = 10";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Lista Przepisów</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #fff8e7;
      text-align: center;
      margin: 0;
      padding: 40px 0;
    }
    h1 {
      color: #d17a22;
      font-size: 48px;
      text-shadow: 2px 2px 6px rgba(0,0,0,0.2);
      margin-bottom: 50px;
    }
    .przepis {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      width: 70%;
      margin: 0 auto 40px;
      padding: 20px;
      text-align: left;
    }
    .przepis h2 {
      color: #333;
      margin-bottom: 10px;
    }
    .przepis p {
      color: #555;
      line-height: 1.6;
    }
    .label {
      color: #d17a22;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>🍰 Lista Przepisów</h1>

  <?php
  if ($result && $result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          echo "<div class='przepis'>";
          echo "<h2>" . htmlspecialchars($row['Tytul']) . "</h2>";
          echo "<p><span class='label'>Opis:</span> " . htmlspecialchars($row['Opis']) . "</p>";
          echo "<p><span class='label'>Instrukcje:</span><br>" . nl2br(htmlspecialchars($row['Instrukcje'])) . "</p>";
          echo "<p><span class='label'>Czas przygotowania:</span> " . htmlspecialchars($row['CzasPrzygotowania']) . " min</p>";
          echo "<p><span class='label'>Czas gotowania:</span> " . htmlspecialchars($row['CzasGotowania']) . " min</p>";
          echo "<p><span class='label'>Porcje:</span> " . htmlspecialchars($row['Porcje']) . "</p>";
          echo "<p><span class='label'>Data dodania:</span> " . htmlspecialchars($row['DataDodania']) . "</p>";
          echo "</div>";
      }
  } else {
      echo "<p>Brak przepisów w bazie.</p>";
  }

  $conn->close();
  ?>
</body>
</html>

# Github User Finder Project
Project ini merupakan sebuah project web dimana pengguna dapat mencatat pemasukan dan pengeluaran. Project ini menggunakan praktik devops di keseluruahan proses pengembangan. Aplikasi ini menggunakan kotlin sebagai dasar dari aplikasi ini. 

Berikut adalah pengembang dari project ini
* Titus Patrick Lovsufer Sinaga / 5026211027
* Alya Resti Saraswati / 5026211057
* Maharani Putri Efendi / 5026211095

  1. Install Git melalui gitlab

Akses link berikut dan lakukan instalasi <a>[Link Download](https://www.git-scm.com/downloads)<a> 

2. Clone file repository ke IDE 

Pastikan IDE  terhubung dengan akun github. Kemudian buka terminal dan ketik
```sh
 git clone https://github.com/tituspat/spendee.git
```
## Commit ke Repository
Cara melakukan commit perubahan ke repository berfokus pada penggunaan IDE daripada terminal

1. Pilih  branch yang akan dicommit

Pada halaman commit atau source control pastikan project nya terhubung dengan repository sehingga halaman tersebut dapat diakses. Kemudian pilih file dan branch  yang akan di commit ke repository. Ketikkan perintah git add 
```sh
git checkout -b nama_branch_baru
```
atau
```sh
git checkout -b nama_branch_baru
```
2. Berikan komentar setiap commit

Terdapat input khusus untuk melakukan commit isi pesan apa yang ingin disampaikan setiap kali akan melakukan commit.
``` sh
git commit -m "message"
```

3. Commit dan Push perubahan

Dari file-file tersebut lakukan commit dan push ke repository sesuai dengan branch yang telah diatur. Setiap kali melakukan commit terdapat task-task dari github action yang berjalan dengan sendirinya. Atau jika menggunakan terminal gunakan command berikut.
git push origin "branch"


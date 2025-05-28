# Gallery-Website
![image](https://github.com/user-attachments/assets/409ddb25-c656-4487-a853-f72643bab212)

---

## Live Demo
https://gallery.panelladikes.com.gr/

https://jellyfish-app-pu66h.ondigitalocean.app/

## Install
1.	Δημιουργήστε μια βάση δεδομένων τύπου mariadb χρησιμοποιώντας την δομή που περιγράφεται στο αρχείο [gallery.sql](https://github.com/ssveronis/Gallery-Website/blob/main/gallery.sql)
2.	Να έχετε έτοιμο έναν SMTP server και πρόσβαση σε μια διεύθυνση email τον οποίο θα χρησιμοποιεί η εφαρμογή για να στείλει μηνύματα ηλεκτρονικού ταχυδρομείου.
3.	Εγκαταστήστε την εφαρμογή:
   
   a.	Σε Windows

```powershell
iwr https://raw.githubusercontent.com/ssveronis/Gallery-Website/refs/heads/main/install/setup.ps1 | iex
```
   b.  Σε Linux

```bash
curl -O https://raw.githubusercontent.com/ssveronis/Gallery-Website/refs/heads/main/install/setup.sh && chmod +x setup.sh && ./setup.sh
```

4.	Ακολουθήστε τις οδηγίες εγκατάστασης που εμφανίζονται στο τερματικό. Θα σας ζητηθούν οι ακόλουθες τιμές:

| Μεταβλητή |                                        Περιγραφή                                        |
|-----------|:---------------------------------------------------------------------------------------:|
|   PORT    |Η πόρτα στην οποία ακούει η εφαρμογή                                                     |
|  DOMAIN   |Το domain στο οποίο βρίσκεται η ιστοσελίδα. Χρησιμοποιείται μόνο κατά την αποστολή email.|
|  DB_USER  |To user name για την βάση δεδομένων                                                      |
|  DB_PASS  |Ο κωδικός της βάσης δεδομένων                                                            |
|  DB_HOST  |IP ή HOSTNAME στο οποίο βρίσκεται η βάση δεδομένων                                       |
|  DB_PORT  |Η πόρτα στην οποία ακούει η βάση δεδομένων                                               |
|  DB_NAME  |Το όνομα της βάσης δεδομένων                                                             |
| MAIL_HOST |IP ή HOSTNAME του SMTP server                                                            |
| MAIL_PORT |Η πόρτα του SMTP server                                                                  |
| MAIL_USER |Η διεύθυνση email                                                                        |
| MAIL_PASS |Ο κωδικός του γραμματοκιβωτίου                                                           |

5.	Θα δημιουργηθεί ένας λογαριασμός με όνομα σύνδεσης admin και κωδικό admin. Μπορείτε να αλλάξετε τον κωδικό μέσω της λειτουργίας ανάκτησης κωδικού της ιστοσελίδας, χρησιμοποιώντας την διεύθυνση email που εισάχθηκε στο τελευταίο βήμα.

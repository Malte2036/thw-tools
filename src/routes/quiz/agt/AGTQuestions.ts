import type { Question } from './Question';

export const AGTQuestions: Question[] = [
	{
		answers: [
			{ letter: 'a', text: 'Mund', correct: true },
			{ letter: 'b', text: 'Nase', correct: true },
			{ letter: 'c', text: 'Lungenbl\u00e4schen', correct: false },
			{ letter: 'd', text: 'Bronchien', correct: false }
		],
		number: 1,
		text: 'Den oberen Atemwegen werden zugeordnet:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'das Heben der Rippen und Spannen des Zwerchfells.',
				correct: true
			},
			{ letter: 'b', text: 'das Einziehen des Bauches.', correct: false },
			{
				letter: 'c',
				text: 'das Ausdehnen der Bronchien.',
				correct: false
			},
			{ letter: 'd', text: 'das Weiten der Wangen.', correct: false }
		],
		number: 2,
		text: 'Der f\u00fcr die Einatmung notwendige Unterdruck im Brustraum wird erzeugt durch'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Mund, Nase, Rachen, Lunge, Alveolen',
				correct: false
			},
			{
				letter: 'b',
				text: 'Luftr\u00f6hre, Bronchiolen, Bronchien, linker und rechter Lungenfl\u00fcgel',
				correct: false
			},
			{ letter: 'c', text: 'Mund, Nase, Rachenraum', correct: false },
			{ letter: 'd', text: 'Kehlkopf, Bronchien, Lunge', correct: true }
		],
		number: 3,
		text: 'Die unteren Atemwege des Menschen setzen sich zusammen aus:'
	},
	{
		answers: [
			{ letter: 'a', text: 'Bronchien', correct: false },
			{ letter: 'b', text: 'Luftr\u00f6hre', correct: false },
			{ letter: 'c', text: 'Alveolen', correct: true },
			{ letter: 'd', text: 'Venen', correct: false }
		],
		number: 4,
		text: 'Der Gasaustausch, als Teil des Atemvorgangs, findet statt in den'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'der Austausch von Sauerstoff und Kohlendioxid in den Lungenbl\u00e4schen',
				correct: true
			},
			{
				letter: 'b',
				text: 'die Zuf\u00fchrung von Sauerstoff in die K\u00f6rperzellen',
				correct: false
			},
			{ letter: 'c', text: 'die Ein- und Ausatmung', correct: false },
			{
				letter: 'd',
				text: 'der Ersatz von Kohlenmonoxid (CO) durch Kohlendioxid (CO 2 )',
				correct: false
			}
		],
		number: 5,
		text: 'Unter "Gasaustausch" ist zu verstehen:'
	},
	{
		answers: [
			{ letter: 'a', text: 'ca. 15 Vol.-%.', correct: false },
			{ letter: 'b', text: 'ca. 17 Vol.-%.', correct: false },
			{ letter: 'c', text: 'ca. 21 Vol.-%.', correct: true },
			{ letter: 'd', text: 'ca. 23 Vol.-%.', correct: false }
		],
		number: 6,
		text: 'In der normalen Einatemluft liegt die Sauerstoffkonzentration bei'
	},
	{
		answers: [
			{
				letter: 'a',
				text: '78 % Stickstoff, ca. 4 % Kohlendioxid, 17 % Sauerstoff, Rest Edelgase',
				correct: false
			},
			{
				letter: 'b',
				text: '78 % Stickstoff, 0,04 % Kohlendioxid, 21 % Sauerstoff, Rest Edelgase',
				correct: true
			},
			{
				letter: 'c',
				text: '78 % Stickstoff, ca. 4 % Edelgase, 17 % Sauerstoff, Rest Kohlenmonoxid',
				correct: false
			},
			{
				letter: 'd',
				text: '78 % Stickstoff, ca. 1 % Kohlendioxid, 21 % Edelgase, Rest Sauerstoff',
				correct: false
			}
		],
		number: 7,
		text: 'Die Einatemluft besteht aus:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: '20 % Sauerstoff, 78 % Stickstoff, 2 % Wasserdampf',
				correct: false
			},
			{
				letter: 'b',
				text: '21 % Sauerstoff, 79 % Stickstoff',
				correct: false
			},
			{
				letter: 'c',
				text: '21 % Sauerstoff, 0,96 % Edelgase, 0,04 % Kohlendioxid, 78 % Stickstoff',
				correct: true
			},
			{
				letter: 'd',
				text: '17 % Sauerstoff, 0,96 % Edelgase, 4,04 % Kohlenmonoxid, 78 % Stickstoff',
				correct: false
			}
		],
		number: 8,
		text: 'Die atmosph\u00e4rische Luft setzt sich zusammen:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: '78 % Stickstoff, 4,04 % Kohlendioxid, 17 % Sauerstoff, Rest Edelgase',
				correct: true
			},
			{
				letter: 'b',
				text: '78 % Stickstoff, 0,04 % Kohlendioxid, 21 % Sauerstoff, Rest Edelgase',
				correct: false
			},
			{
				letter: 'c',
				text: '78 % Stickstoff, ca. 4 % Edelgase, 17 % Sauerstoff, Rest Kohlendioxid',
				correct: false
			},
			{
				letter: 'd',
				text: '78 % Stickstoff, 4 % Kohlenoxid (CO), 17 % Sauerstoff, Rest Kohlendioxid',
				correct: false
			}
		],
		number: 9,
		text: 'Die Ausatemluft besteht aus:'
	},
	{
		answers: [
			{ letter: 'a', text: 'das Blutplasma', correct: false },
			{
				letter: 'b',
				text: 'die wei\u00dfen Blutk\u00f6rperchen',
				correct: false
			},
			{
				letter: 'c',
				text: 'das H\u00e4moglobin der roten Blutk\u00f6rperchen',
				correct: true
			},
			{ letter: 'd', text: 'die Blutpl\u00e4ttchen', correct: false }
		],
		number: 10,
		text: 'F\u00fcr den Sauerstofftransport im Blut ist zust\u00e4ndig:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'dem K\u00f6rper Kohlendioxid zuf\u00fchren:',
				correct: false
			},
			{
				letter: 'b',
				text: 'das in den Zellen beim Stoffwechsel entstehende Kohlendioxid an die Umgebung abf\u00fchren.',
				correct: true
			},
			{
				letter: 'c',
				text: 'den K\u00f6rperzellen lebenswichtigen Sauerstoff zuf\u00fchren.',
				correct: true
			},
			{
				letter: 'd',
				text: 'den K\u00f6rper zu entschlacken.',
				correct: false
			}
		],
		number: 11,
		text: 'Die Atmung hat die Funktion'
	},
	{
		answers: [
			{ letter: 'a', text: '40 - 50 l/min.', correct: true },
			{ letter: 'b', text: '60 - 80 l/min.', correct: false },
			{ letter: 'c', text: '20 - 30 l/min.', correct: false },
			{ letter: 'd', text: '15 - 35 l/min.', correct: false }
		],
		number: 12,
		text: 'Der Luftverbrauch betr\u00e4gt bei mittelschwerer Arbeit etwa'
	},
	{
		answers: [
			{ letter: 'a', text: 'ca. 2 - 3 Liter Luft', correct: true },
			{ letter: 'b', text: 'ca. 3 - 5 Liter Luft', correct: false },
			{ letter: 'c', text: 'ca. 5 - 10 Liter Luft', correct: false },
			{ letter: 'd', text: 'ca. 7 - 9 Liter Luft', correct: false }
		],
		number: 13,
		text: 'Bei mittelschwerer Arbeit werden pro Atemzug eingeatmet:'
	},
	{
		answers: [
			{ letter: 'a', text: '5 \u2013 10 Atemz\u00fcge', correct: false },
			{ letter: 'b', text: '10 \u2013 15 Atemz\u00fcge', correct: false },
			{ letter: 'c', text: '15 \u2013 20 Atemz\u00fcge', correct: true },
			{ letter: 'd', text: '25 \u2013 30 Atemz\u00fcge', correct: false }
		],
		number: 14,
		text: 'Die Anzahl der Atemz\u00fcge bei mittelschwerer Arbeit pro Minute betr\u00e4gt:'
	},
	{
		answers: [
			{ letter: 'a', text: '20 l/min', correct: false },
			{ letter: 'b', text: '80 l/min', correct: false },
			{ letter: 'c', text: '50 l/min', correct: true },
			{ letter: 'd', text: '60 l/min', correct: false }
		],
		number: 15,
		text: 'Der mittlere Atemluftverbrauch eines unter PA arbeitenden Menschen mit w\u00e4rmeisolierender Schutzkleidung betr\u00e4gt:'
	},
	{
		answers: [
			{ letter: 'a', text: 'Isolierger\u00e4t.', correct: true },
			{
				letter: 'b',
				text: 'Beh\u00e4lterger\u00e4t mit Sauerstoff.',
				correct: false
			},
			{
				letter: 'c',
				text: 'Flaschenger\u00e4t mit Filter.',
				correct: false
			},
			{
				letter: 'd',
				text: 'umluftabh\u00e4ngiges Atemschutzger\u00e4t.',
				correct: false
			}
		],
		number: 16,
		text: 'Der Pressluftatmer ist ein'
	},
	{
		answers: [
			{ letter: 'a', text: 'im festen Aggregatzustand', correct: true },
			{ letter: 'b', text: 'dampff\u00f6rmig', correct: true },
			{ letter: 'c', text: 'gasf\u00f6rmig', correct: true },
			{
				letter: 'd',
				text: 'zum Teil auch in sichtbarer Form',
				correct: true
			}
		],
		number: 17,
		text: 'Atemgifte k\u00f6nnen auftreten:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'das Vorhandensein von Schwebstoffen, Gasen und D\u00e4mpfen',
				correct: false
			},
			{
				letter: 'b',
				text: 'die Wirkung von Chlorgas auf die Atemorgane',
				correct: false
			},
			{
				letter: 'c',
				text: 'Stoffe, die mit der Atmung in den K\u00f6rper gelangen und dort sch\u00e4digend wirken',
				correct: true
			},
			{
				letter: 'd',
				text: 'das Vorhandensein von gesundheitssch\u00e4dlichen Fremdstoffen in der Umgebungsatmosph\u00e4re',
				correct: false
			}
		],
		number: 18,
		text: 'Unter dem Begriff Atemgifte ist/sind zu verstehen:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Verschlei\u00df des Knochenmarkes',
				correct: false
			},
			{ letter: 'b', text: 'Beschleunigung der Atmung', correct: true },
			{ letter: 'c', text: 'Reiz- und \u00c4tzwirkung', correct: true },
			{
				letter: 'd',
				text: 'Blockierung des Sauerstofftransportes',
				correct: true
			}
		],
		number: 19,
		text: 'Atemgifte k\u00f6nnen auf den menschlichen K\u00f6rper folgende Wirkungen haben:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'durch eine Geruchs- und Geschmacksprobe',
				correct: false
			},
			{
				letter: 'b',
				text: 'durch schimmernde Luftschichten',
				correct: false
			},
			{
				letter: 'c',
				text: 'nur durch geeignete Messtechnik',
				correct: true
			},
			{
				letter: 'd',
				text: 'durch Einschr\u00e4nkung der k\u00f6rperlichen und geistigen Leistungsf\u00e4higkeit',
				correct: false
			}
		],
		number: 20,
		text: 'Sauerstoffmangel kann an Einsatzstellen ausreichend sicher wahrgenommen werden:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'mit Reiz- und \u00c4tzwirkung.',
				correct: false
			},
			{ letter: 'b', text: 'mit erstickender Wirkung.', correct: false },
			{
				letter: 'c',
				text: 'mit Wirkung auf Blut, Nerven und Zellen.',
				correct: true
			},
			{
				letter: 'd',
				text: 'mit Wirkung auf das Wahrnehmungsverm\u00f6gen (Sinnestr\u00fcbungen, Ohnmacht, Sehverm\u00f6gen).',
				correct: false
			}
		],
		number: 21,
		text: '\u201eBenzind\u00e4mpfe\u201c sind definitionsgem\u00e4\u00df zuzuordnen den Atemgiften mit'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'bei der Zersetzung aller Pflanzenschutzmittel',
				correct: false
			},
			{
				letter: 'b',
				text: 'bei Br\u00e4nden von anorganischem Material z.B. Glasfasern',
				correct: false
			},
			{ letter: 'c', text: 'bei Gasbr\u00e4nden', correct: false },
			{
				letter: 'd',
				text: 'bei der Zersetzung von D\u00fcngemitteln mit Stickstoffanteil',
				correct: true
			}
		],
		number: 22,
		text: 'Mit dem Auftreten gr\u00f6\u00dferer Mengen nitroser Gase ist zu rechnen:'
	},
	{
		answers: [
			{ letter: 'a', text: '16 - 50 Jahren.', correct: false },
			{ letter: 'b', text: '18 - 50 Jahren.', correct: false },
			{ letter: 'c', text: '18 - 67 Jahren.', correct: true },
			{ letter: 'd', text: '18 - 55 Jahren.', correct: false }
		],
		number: 23,
		text: 'Die zul\u00e4ssige Altersspanne f\u00fcr Tr\u00e4ger umluftabh\u00e4ngiger Atemschutzger\u00e4te bei der Feuerwehr liegt zwischen'
	},
	{
		answers: [
			{ letter: 'a', text: 'j\u00e4hrlich', correct: false },
			{
				letter: 'b',
				text: 'in Abst\u00e4nden von 3 Jahren',
				correct: true
			},
			{ letter: 'c', text: 'alle 2 Jahre', correct: false },
			{
				letter: 'd',
				text: 'ggf. in k\u00fcrzeren Abst\u00e4nden nach Ermessen des erm\u00e4chtigten Arztes',
				correct: true
			}
		],
		number: 24,
		text: '\u00c4rztliche Untersuchungen f\u00fcr Atemschutzger\u00e4tetr\u00e4ger (bis zum 50'
	},
	{
		answers: [
			{ letter: 'a', text: 'truppweise vorzugehen ist.', correct: true },
			{
				letter: 'b',
				text: 'grunds\u00e4tzlich immer alle verf\u00fcgbaren Ger\u00e4tetr\u00e4ger einzusetzen sind.',
				correct: false
			},
			{
				letter: 'c',
				text: 'Sicherheitstrupps (\u201eRettungstrupp\u201c nach UVV) zu stellen sind.',
				correct: true
			},
			{
				letter: 'd',
				text: 'eine Atemschutz\u00fcberwachung nur beim Vorgehen in Geb\u00e4ude erforderlich ist.',
				correct: false
			}
		],
		number: 25,
		text: 'Die Unfallverh\u00fctungsvorschriften der Feuerwehren schreiben vor, dass'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'ist das Manometer zu kontrollieren und weiter zu arbeiten.',
				correct: false
			},
			{
				letter: 'b',
				text: 'hat der betreffende Atemschutzger\u00e4tetr\u00e4ger sofort den R\u00fcckweg anzutreten.',
				correct: false
			},
			{
				letter: 'c',
				text: 'tritt der Trupp geschlossen den R\u00fcckzug an.',
				correct: true
			},
			{
				letter: 'd',
				text: 'ist unverz\u00fcglichen die Feuerwehreinsatzleitstelle zu informieren.',
				correct: false
			}
		],
		number: 26,
		text: 'Beim Ansprechen der Warneinrichtung an einem Atemschutzger\u00e4t'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'je nach Lage Pressluftatmer und Filterger\u00e4te kombiniert eingesetzt werden.',
				correct: false
			},
			{
				letter: 'b',
				text: 'nach der UVV-Feuerwehren nur PA und SSG kombiniert eingesetzt werden.',
				correct: false
			},
			{
				letter: 'c',
				text: 'nur Ger\u00e4te mit gleichen Gebrauchsmerkmalen eingesetzt werden.',
				correct: true
			},
			{
				letter: 'd',
				text: 'nur Ger\u00e4te des gleichen Herstellers eingesetzt werden.',
				correct: false
			}
		],
		number: 27,
		text: 'Wenn ein Trupp unter Atemschutz vorgeht, d\u00fcrfen'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'ein Ein-Flaschenger\u00e4t (300 bar) und einem Schlauchger\u00e4t grunds\u00e4tzlich nicht, zusammen eingesetzt werden d\u00fcrfen.',
				correct: true
			},
			{
				letter: 'b',
				text: 'auch Ger\u00e4te verschiedener Hersteller in einem Trupp zusammen eingesetzt werden d\u00fcrfen.',
				correct: true
			},
			{
				letter: 'c',
				text: 'Filterger\u00e4te und Pressluftatmer nicht zusammen eingesetzt werden d\u00fcrfen.',
				correct: true
			},
			{
				letter: 'd',
				text: 'grunds\u00e4tzlich nur Atemfilter mit gleicher Schutzwirkung und gleichem R\u00fcckhalteverm\u00f6gen eingesetzt werden d\u00fcrfen.',
				correct: true
			}
		],
		number: 28,
		text: 'Unter dem Einsatzgrundsatz "Gleiche Typen einer Ger\u00e4teart sind zu verwenden!" ist zu verstehen, dass'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'das Notieren der Namen der eingesetzten Ger\u00e4tetr\u00e4ger, der Flaschendr\u00fccke, der Einsatzzeiten und der Ger\u00e4tenummern',
				correct: true
			},
			{
				letter: 'b',
				text: 'das Feststellen der Anzahl der vorhandenen PA',
				correct: false
			},
			{
				letter: 'c',
				text: 'die Feststellung des Herstellungsjahres der Atemschutzmasken',
				correct: false
			},
			{
				letter: 'd',
				text: 'das \u00dcberpr\u00fcfen des Typenschildes des verwendeten Atemschutzger\u00e4tes',
				correct: false
			}
		],
		number: 29,
		text: 'Zu der Atemschutz\u00fcberwachung geh\u00f6rt unter anderem:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'sie k\u00f6rperlich gesund sind, mindestens 18 Jahre alt sind, seit 5 Jahren der Feuerwehr angeh\u00f6ren und die Einsatzkurzpr\u00fcfung des PA beherrschen.',
				correct: false
			},
			{
				letter: 'b',
				text: 'wenn sie erfolgreich den Truppf\u00fchrerlehrgang absolviert haben.',
				correct: false
			},
			{
				letter: 'c',
				text: 'wenn sie nicht unter 18 Jahre alt sind, \u00e4rztlich untersucht, als Atemschutzger\u00e4tetr\u00e4ger ausgebildet sind und die erforderlichen Nachweise erbracht haben.',
				correct: true
			},
			{
				letter: 'd',
				text: 'sie momentan k\u00f6rperlich fit sind und eine Unterweisung durch andere Atemschutz- ger\u00e4tetr\u00e4ger erhalten haben.',
				correct: false
			}
		],
		number: 30,
		text: 'An einer Einsatzstelle k\u00f6nnen Feuerwehrangeh\u00f6rige (Sb# als Atemschutzger\u00e4tetr\u00e4ger eingesetzt werden, wenn'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Flaschenf\u00fclldruckkontrolle, Niederdruckpr\u00fcfung, Funktionspr\u00fcfung des LA, Kontrolle des Ansprechdrucks der Restdruckwarneinrichtung',
				correct: false
			},
			{
				letter: 'b',
				text: 'Sichtpr\u00fcfung, Flaschenf\u00fclldruckkontrolle, Hochdruckdichtpr\u00fcfung, Funktionspr\u00fcfung des LA, Kontrolle des Ansprechdrucks der Restdruckwarneinrichtung',
				correct: true
			},
			{
				letter: 'c',
				text: 'Sichtpr\u00fcfung, Flaschenf\u00fclldruckkontrolle, LA - Pr\u00fcfung, Pr\u00fcfen der Warneinrichtung',
				correct: false
			},
			{
				letter: 'd',
				text: 'Sichtpr\u00fcfung, Druckpr\u00fcfung, Dichtpr\u00fcfung, LA \u2013 Pr\u00fcfung, Notsignalpr\u00fcfung',
				correct: false
			}
		],
		number: 31,
		text: 'Die Einsatzkurzpr\u00fcfung besteht aus'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'f\u00fcr Notf\u00e4lle in Bereitschaft stehen.',
				correct: true
			},
			{
				letter: 'b',
				text: 'f\u00fcr die Brandbek\u00e4mpfung ein zweites Rohr vornehmen.',
				correct: false
			},
			{
				letter: 'c',
				text: 'grunds\u00e4tzlich als erster Trupp Geb\u00e4ude nach vermissten Personen abzusuchen.',
				correct: false
			},
			{
				letter: 'd',
				text: 'die Einsatzstellensicherung durchzuf\u00fchren.',
				correct: false
			}
		],
		number: 32,
		text: 'Ein Sicherheitstrupp hat beim Atemschutzeinsatz die Aufgabe'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'wenn der Sauerstoffgehalt der Atemluft 17 Vol.-% unterschreitet.',
				correct: true
			},
			{
				letter: 'b',
				text: 'wenn Kohlenmonoxid zu erwarten ist.',
				correct: true
			},
			{
				letter: 'c',
				text: 'wenn die zu erwartenden Atemgifte nicht eingesch\u00e4tzt werden k\u00f6nnen.',
				correct: true
			},
			{
				letter: 'd',
				text: 'wenn der Gruppenf\u00fchrer dieses anordnet.',
				correct: true
			}
		],
		number: 33,
		text: 'An Einsatzstellen muss umluftunabh\u00e4ngiger Atemschutz eingesetzt werden,'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'mindestens einen Truppf\u00fchrer und einen Truppmitglied',
				correct: true
			},
			{
				letter: 'b',
				text: 'mindestens einen Truppf\u00fchrer und drei Truppmitglieder',
				correct: false
			},
			{
				letter: 'c',
				text: 'mindestens den Truppf\u00fchrer',
				correct: false
			},
			{
				letter: 'd',
				text: 'den Truppf\u00fchrer und weitere Truppmitglieder im Ermessen des Truppf\u00fchrers',
				correct: false
			}
		],
		number: 34,
		text: 'Ein Atemschutztrupp umfasst im Regelfall:'
	},
	{
		answers: [
			{ letter: 'a', text: 'ein Schlauchhalter.', correct: false },
			{ letter: 'b', text: 'eine Feuerwehrleine.', correct: true },
			{
				letter: 'c',
				text: 'ein Handsprechfunkger\u00e4t.',
				correct: false
			},
			{ letter: 'd', text: 'die Schlauchleitung.', correct: true }
		],
		number: 35,
		text: 'Die ausreichende Sicherung ist f\u00fcr einen Atemschutztrupp ist'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'einer Belastungs\u00fcbung in einer anerkannten Atemschutz\u00fcbungsstrecke',
				correct: true
			},
			{
				letter: 'b',
				text: 'an einer realistische \u00dcbung unter Einsatzbedingungen',
				correct: true
			},
			{
				letter: 'c',
				text: 'an einer theoretische Unterweisung',
				correct: true
			},
			{
				letter: 'd',
				text: 'an Aus- und Fortbildungsma\u00dfnahmen im Ermessen des Ger\u00e4tewartes',
				correct: false
			}
		],
		number: 36,
		text: 'Ein Atemschutzger\u00e4tetr\u00e4ger hat im Rahmen der laufenden Ausbildung teilzunehmen an:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'die G 26.3 Untersuchung vor Beginn der Ausbildung erforderlich ist.',
				correct: true
			},
			{
				letter: 'b',
				text: 'die G 26.3 Untersuchung ab dem 50. Lebensjahr j\u00e4hrlich wiederholt werden muss.',
				correct: true
			},
			{
				letter: 'c',
				text: 'die G 26.2 Untersuchung f\u00fcr das Tragen von Filterger\u00e4ten mit Kombinationsfilter, erforderlich ist.',
				correct: true
			},
			{
				letter: 'd',
				text: 'die G 26.3 Untersuchung ausschlie\u00dflich im Ermessen des zust\u00e4ndigen Arztes erfolgt.',
				correct: false
			}
		],
		number: 37,
		text: 'Richtig ist die Behauptung, dass'
	},
	{
		answers: [
			{ letter: 'a', text: 'der Umluft.', correct: false },
			{ letter: 'b', text: 'dem Ort.', correct: false },
			{ letter: 'c', text: 'der Zeit.', correct: true },
			{ letter: 'd', text: 'dem Wetter.', correct: false }
		],
		number: 38,
		text: 'Der Pressluftatmer ist abh\u00e4ngig von'
	},
	{
		answers: [
			{ letter: 'a', text: 'Regenerationsger\u00e4te.', correct: true },
			{ letter: 'b', text: 'Filterger\u00e4te.', correct: false },
			{ letter: 'c', text: 'Pressluftatmer.', correct: true },
			{ letter: 'd', text: 'Schlauchger\u00e4te.', correct: true }
		],
		number: 39,
		text: 'Umluftunabh\u00e4ngig sind'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'dem Maskenk\u00f6rper, der Warneinrichtung, der B\u00e4nderung.',
				correct: false
			},
			{
				letter: 'b',
				text: 'dem Atemanschluss und dem Atemfilter.',
				correct: true
			},
			{
				letter: 'c',
				text: 'der Atemschutzmaske und dem Lungenautomaten.',
				correct: false
			},
			{
				letter: 'd',
				text: 'der Atemschutzmaske, dem Atemfilter und einer Druckluftflasche.',
				correct: false
			}
		],
		number: 40,
		text: 'Ein Filterger\u00e4t besteht aus'
	},
	{
		answers: [
			{ letter: 'a', text: 'Einwegmaske.', correct: false },
			{ letter: 'b', text: 'Zweiwegmaske.', correct: true },
			{
				letter: 'c',
				text: 'ventillose Atemschutzmaske.',
				correct: false
			},
			{ letter: 'd', text: 'Mundst\u00fcckgarnitur.', correct: false }
		],
		number: 41,
		text: 'Als Atemanschluss an einem Pressluftatmer verwendet man eine'
	},
	{
		answers: [
			{ letter: 'a', text: 'betr\u00e4gt 2 Jahre.', correct: false },
			{
				letter: 'b',
				text: 'betr\u00e4gt mindestens 4 Jahre.',
				correct: true
			},
			{
				letter: 'c',
				text: 'ist aus der Herstellerangabe ersichtlich.',
				correct: true
			},
			{
				letter: 'd',
				text: 'ist abh\u00e4ngig von den Lagerbedingungen.',
				correct: false
			}
		],
		number: 42,
		text: 'Die Lagerzeit des fabrikverschlossenen Atemfilters'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'muss die Umluft gen\u00fcgend Sauerstoff enthalten (mind. 17 Vol.-%).',
				correct: true
			},
			{
				letter: 'b',
				text: 'darf die Umluft kein Kohlendioxid (CO 2 ) und max. 3 Vol.-% Giftstoffe enthalten.',
				correct: false
			},
			{
				letter: 'c',
				text: 'die Umluft darf kein Kohlenmonoxid (CO) und max. 0,5 Vol.-% Giftstoffe enthalten.',
				correct: true
			},
			{
				letter: 'd',
				text: 'muss der Gruppenf\u00fchrer den Einsatz von Filterger\u00e4ten angeordnet haben.',
				correct: true
			}
		],
		number: 43,
		text: 'Beim Einsatz eines Filterger\u00e4tes (ABEK 2-P c#'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'ein niedriges R\u00fcckhalteverm\u00f6gen.',
				correct: false
			},
			{
				letter: 'b',
				text: 'ein mittleres R\u00fcckhalteverm\u00f6gen.',
				correct: false
			},
			{
				letter: 'c',
				text: 'ein hohes R\u00fcckhalteverm\u00f6gen.',
				correct: true
			},
			{
				letter: 'd',
				text: 'ein maximales R\u00fcckhalteverm\u00f6gen von 300 Gramm Partikel.',
				correct: false
			}
		],
		number: 44,
		text: 'Bei Gas- und Kombinationsfilter steht die Partikelfilterklasse P 3 f\u00fcr'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'von der Umgebungsatmosph\u00e4re und von der Zeit.',
				correct: true
			},
			{
				letter: 'b',
				text: 'nur von der Umgebungsatmosph\u00e4re.',
				correct: false
			},
			{ letter: 'c', text: 'nur von der Zeit.', correct: false },
			{ letter: 'd', text: 'vom Ort.', correct: false }
		],
		number: 45,
		text: 'Ein Filterger\u00e4t ist abh\u00e4ngig'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'bei starkem Funkenflug (z.B. Trennschneiden)',
				correct: true
			},
			{
				letter: 'b',
				text: 'bei kleinen Mengen ausgelaufener rechtsdrehender Milchs\u00e4ure',
				correct: false
			},
			{
				letter: 'c',
				text: 'bei starker Flocken- oder Staubbildung',
				correct: true
			},
			{ letter: 'd', text: 'im Zweifelsfall', correct: true }
		],
		number: 46,
		text: 'Filterger\u00e4te d\u00fcrfen nicht verwendet werden:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'bei Aufr\u00e4umarbeiten im Freien und in verqualmten R\u00e4umen',
				correct: false
			},
			{
				letter: 'b',
				text: 'bei Arbeiten in Kellern, Brunnen und Sch\u00e4chten',
				correct: false
			},
			{
				letter: 'c',
				text: 'bei Wald- und Heidebr\u00e4nden',
				correct: true
			},
			{
				letter: 'd',
				text: 'im unter Beachtung der Einsatzgrenzen und im Ermessen des Einsatzleiters',
				correct: true
			}
		],
		number: 47,
		text: 'Filterger\u00e4te d\u00fcrfen eingesetzt werden:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'zu den umluftabh\u00e4ngigen Atemschutzger\u00e4ten.',
				correct: true
			},
			{
				letter: 'b',
				text: 'zu den umluftunabh\u00e4ngigen Atemschutzger\u00e4ten.',
				correct: false
			},
			{
				letter: 'c',
				text: 'zu den Rettungsger\u00e4ten (Fluchtger\u00e4ten).',
				correct: true
			},
			{ letter: 'd', text: 'zu den Filterger\u00e4ten.', correct: true }
		],
		number: 48,
		text: 'Brandfluchthauben geh\u00f6ren'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Beh\u00e4lterger\u00e4t mit Druckluft.',
				correct: true
			},
			{
				letter: 'b',
				text: 'Beh\u00e4lterger\u00e4t mit Sauerstoff.',
				correct: false
			},
			{ letter: 'c', text: 'Flaschenger\u00e4t.', correct: false },
			{
				letter: 'd',
				text: 'umluftunabh\u00e4ngiges Atemschutzger\u00e4t.',
				correct: true
			}
		],
		number: 49,
		text: 'Der Pressluftatmer ist ein'
	},
	{
		answers: [
			{ letter: 'a', text: 'Lungenautomaten', correct: false },
			{ letter: 'b', text: 'Druckminderer', correct: true },
			{ letter: 'c', text: 'Ventilgeh\u00e4use', correct: false },
			{ letter: 'd', text: 'Flaschenventil', correct: false }
		],
		number: 50,
		text: 'Die aus den Druckluftflaschen str\u00f6mende Luft wird zuerst entspannt in einem:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Riemen, Sauerstoffflasche, Druckkasten, Lungenautomat, Signal, Druckmesser',
				correct: false
			},
			{
				letter: 'b',
				text: 'Traggestell, Atemluftflasche, Druckminderer, Lungenautomat, Manometer, Warneinrichtung',
				correct: true
			},
			{
				letter: 'c',
				text: 'Atemschutzmaske, Flasche, R\u00fcckzugsignal, Atemluftpatrone, Ventile, Manometer',
				correct: false
			},
			{
				letter: 'd',
				text: 'Druckluftbremser, Riemen, Sauerstoffflasche, Druckkasten, Lungenautomat, Signal, Druckmesser',
				correct: false
			}
		],
		number: 51,
		text: 'Die Hauptbestandteile eines Pressluftatmers sind:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Aufgrund der entstehenden Druckdifferenz vor und hinter der Membran beim, Einatemvorgang wird das Kipphebelventil ge\u00f6ffnet. Atemluft str\u00f6mt nun in den Lungenautomaten ein. Ist das Einatmen beendet, findet ein Druckausgleich statt. Das Kipphebelventil schlie\u00dft mittels Federkraft.',
				correct: true
			},
			{
				letter: 'b',
				text: 'Durch den am Kipphebelventil anstehenden Druck wird beim Einatmen Luft in den Lungenautomaten eingelassen, beim Ausatmen entsteht ein \u00dcberdruck, durch den die Membran das Ventil schlie\u00dft.',
				correct: false
			},
			{
				letter: 'c',
				text: 'Der Atemschutzger\u00e4tetr\u00e4ger bet\u00e4tigt regelm\u00e4\u00dfig den Entl\u00fcftungsknopf, dadurch wird das Kipphebelventil ge\u00f6ffnet und Luft str\u00f6mt ein. Beim Ausatmen schlie\u00dft das Einatemventil der Atemschutzmaske, somit wird keine Luft verbraucht.',
				correct: false
			},
			{
				letter: 'd',
				text: 'Str\u00f6mungstechnisch nach dem Injektorprinzip',
				correct: false
			}
		],
		number: 52,
		text: 'Nach welchem Prinzip arbeitet ein Lungenautomat (Membranlungenautomat) eines PA?'
	},
	{
		answers: [
			{ letter: 'a', text: '1600 Liter', correct: true },
			{ letter: 'b', text: '1800 Liter', correct: false },
			{ letter: 'c', text: '1400 Liter', correct: false },
			{ letter: 'd', text: '2000 Liter', correct: false }
		],
		number: 53,
		text: 'Der Atemluftinhalt eines Pressluftatmers betr\u00e4gt mindestens:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'verl\u00e4sst nur der Tr\u00e4ger des betreffenden PA die Einsatzstelle sofort, da dies, das R\u00fcckzugssignal seines Pressluftatmers ist.',
				correct: false
			},
			{
				letter: 'b',
				text: 'verl\u00e4sst der Trupp gemeinsam die Einsatzstelle, nachdem der TF sich vom Flaschenf\u00fclldruck \u00fcberzeugt hat.',
				correct: true
			},
			{
				letter: 'c',
				text: 'hat der Flaschendruck einen bestimmten Wert erreicht.',
				correct: true
			},
			{
				letter: 'd',
				text: 'muss unverz\u00fcglich die Atemschutz\u00fcberwachung informiert werden.',
				correct: true
			}
		],
		number: 54,
		text: 'Bei Ert\u00f6nen der Warneinrichtung eines PA'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'gruppenweise, ein F\u00fchrer, acht Mitglieder',
				correct: false
			},
			{
				letter: 'b',
				text: 'truppweise, mindestens ein F\u00fchrer, ein Mitglied',
				correct: true
			},
			{
				letter: 'c',
				text: 'einzeln, damit m\u00f6glichst wenige Feuerwehrangeh\u00f6rige gef\u00e4hrdet werden',
				correct: false
			},
			{
				letter: 'd',
				text: 'nach Weisung des Gruppenf\u00fchrers',
				correct: true
			}
		],
		number: 55,
		text: 'Unter Atemschutzger\u00e4ten ist vorzugehen:'
	},
	{
		answers: [
			{ letter: 'a', text: '18 Minuten', correct: true },
			{ letter: 'b', text: '12 Minuten', correct: false },
			{ letter: 'c', text: '36 Minuten', correct: false },
			{ letter: 'd', text: '24 Minuten', correct: false }
		],
		number: 56,
		text: 'Wenn das Manometer eines 1-Flaschen-Ger\u00e4tes (Inhalt: 6 Liter) 150 bar anzeigt, verbleiben bis zur v\u00f6lligen Entleerung bei einem Atemluftverbrauch von 50 l/min):'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'die L\u00e4nge des R\u00fcckzugwegs beachten, da hierdurch die Einsatzdauer verringert wird.',
				correct: true
			},
			{
				letter: 'b',
				text: 'die L\u00e4nge des R\u00fcckzugswege nicht beachten, da ausschlie\u00dflich die Warneinrichtung ma\u00dfgebend ist.',
				correct: false
			},
			{
				letter: 'c',
				text: 'f\u00fcr den R\u00fcckweg in der Regel die doppelte Atemluftmenge wie f\u00fcr den Hinweg einplanen.',
				correct: true
			},
			{
				letter: 'd',
				text: 'das Erreichen des Einsatzortes der Atemschutz\u00fcberwachung mitteilen.',
				correct: true
			}
		],
		number: 57,
		text: 'Ein unter Pressluftatmern vorgehender Trupp muss'
	},
	{
		answers: [
			{ letter: 'a', text: '30 l/min', correct: false },
			{ letter: 'b', text: '40 l/min', correct: true },
			{ letter: 'c', text: '50 l/min', correct: false },
			{ letter: 'd', text: '20 l/min', correct: false }
		],
		number: 58,
		text: 'Bei einer Einsatzdauer von 15 Minuten \u00e4ndert sich bei einem 1-Flaschen-Ger\u00e4t (6 Liter Inhalt) der Flaschendruck um 100 bar'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'erst beim Ausl\u00f6sen der akustischen Warneinrichtung (55 +/- 5 bar)',
				correct: false
			},
			{ letter: 'b', text: 'bei 120 bar Restdruck', correct: true },
			{ letter: 'c', text: 'bei 80 bar Restdruck', correct: false },
			{ letter: 'd', text: 'bei 155 bar Restdruck', correct: false }
		],
		number: 59,
		text: 'Bei dem Hinweg zur Einsatzstelle hat der Druck um 60 bar abgenommen'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Name, Zeit, Ger\u00e4tenummer, letzte T\u00dcV-\u00dcberpr\u00fcfung',
				correct: false
			},
			{
				letter: 'b',
				text: 'Name, Uhrzeit, F\u00fclldruck zu Beginn, nach 1/3 und nach 2/3 der Einsatzzeit, Einsatzort, Einsatzende, evtl. Funkrufname',
				correct: true
			},
			{
				letter: 'c',
				text: 'Au\u00dfentemperatur, Innentemperatur, Luftfeuchtigkeit, Luftdruck',
				correct: false
			},
			{
				letter: 'd',
				text: 'K\u00f6rpertemperatur, Atemfrequenz, Schuhgr\u00f6\u00dfe, Geburtsdatum',
				correct: false
			}
		],
		number: 60,
		text: 'Im Zuge der Atemschutz\u00fcberwachung werden festgehalten:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'von seiner k\u00f6rperlichen Fitness',
				correct: true
			},
			{ letter: 'b', text: 'von der Einsatzbelastung', correct: true },
			{
				letter: 'c',
				text: 'von dem Gewicht und der W\u00e4rmeisolation der Schutzausr\u00fcstung',
				correct: true
			},
			{
				letter: 'd',
				text: 'von der Bauart des Lungenautomaten',
				correct: false
			}
		],
		number: 61,
		text: 'Der Luftverbrauch eines Atemschutzger\u00e4tetr\u00e4gers ist abh\u00e4ngig:'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Fluchtger\u00e4te und Rettungsger\u00e4te',
				correct: false
			},
			{
				letter: 'b',
				text: 'Filterger\u00e4te und Isolierger\u00e4te',
				correct: true
			},
			{
				letter: 'c',
				text: 'Feuerwehrger\u00e4te und Arbeitsschutzger\u00e4te',
				correct: false
			},
			{
				letter: 'd',
				text: 'Station\u00e4re und mobile Atemschutzger\u00e4te',
				correct: false
			}
		],
		number: 62,
		text: 'In welche zwei Gruppen werden Atemschutzger\u00e4te nach FwDV 7unterteilt?'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'er im Bereich der Dichtlinie des Atemanschlusses K\u00f6rperschmuck tr\u00e4gt.',
				correct: true
			},
			{
				letter: 'b',
				text: 'Kopfbehaarung (Bart, Koteletten, Haupthaar) den Dichtsitz der Maske verhindert.',
				correct: true
			},
			{
				letter: 'c',
				text: 'er Medikamente eingenommen hat, die die k\u00f6rperliche Leistungsf\u00e4higkeit herabsetzen.',
				correct: true
			},
			{
				letter: 'd',
				text: 'er K\u00f6rperschmuck tr\u00e4gt, der beim An- bzw. Ablegen des Atemanschlusses zu Verletzungen f\u00fchren kann.',
				correct: true
			}
		],
		number: 63,
		text: 'Ein Atemschutzger\u00e4tetr\u00e4ger darf nicht in den Atemschutzeinsatz gehen, wenn'
	},
	{
		answers: [
			{
				letter: 'a',
				text: '\u201eMayday; hier <Funkrufname>, <Standort>, <Lage>, melden - mayday!\u201c',
				correct: false
			},
			{
				letter: 'b',
				text: '\u201eHilfe, Hilfe; hier <Funkrufname>, <Standort>, <Lage> - kommen!\u201c',
				correct: false
			},
			{
				letter: 'c',
				text: '\u201eBlitz; hier <Funkrufname>, <Standort>, <Lage> - kommen!\u201c',
				correct: false
			},
			{
				letter: 'd',
				text: '\u201cMayday; mayday; mayday; hier <Funkrufname>, <Standort>, <Lage>, mayday \u2013 kommen!\u201c',
				correct: true
			}
		],
		number: 64,
		text: 'Wie lautet eine korrekte Notfallmeldung?'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Jeder Atemschutzger\u00e4tetr\u00e4ger ist f\u00fcr seine Sicherheit eigenverantwortlich.',
				correct: true
			},
			{
				letter: 'b',
				text: 'Atemschutzger\u00e4te sind immer am Verteiler an- und abzulegen.',
				correct: false
			},
			{
				letter: 'c',
				text: 'Vor dem Einsatz muss eine Einsatzkurzpr\u00fcfung durchgef\u00fchrt werden.',
				correct: true
			},
			{
				letter: 'd',
				text: 'Der Fl\u00fcssigkeitsverlust der Einsatzkr\u00e4fte ist durch geeignete Getr\u00e4nke (z.B. Apfelschorle) auszugleichen.',
				correct: true
			}
		],
		number: 65,
		text: 'Welche allgemeinen Einsatzgrunds\u00e4tze muss ein Atemschutzger\u00e4tetr\u00e4ger beachten?'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'trinken vermeiden, um nicht \u00fcberm\u00e4\u00dfig zu schwitzen.',
				correct: false
			},
			{
				letter: 'b',
				text: 'eine Dichtprobe der Maske (Handballenprobe) durchf\u00fchren.',
				correct: true
			},
			{
				letter: 'c',
				text: 'die Einsatzkurzpr\u00fcfung an ihrem Ger\u00e4t durchf\u00fchren.',
				correct: true
			},
			{
				letter: 'd',
				text: 'den Lungenautomaten truppweise anschlie\u00dfen und gegenseitig den Sitz der Schutzausr\u00fcstung (z.B. Flammschutzhaube) kontrollieren.',
				correct: true
			}
		],
		number: 66,
		text: 'Vor dem Atemschutzeinsatz m\u00fcssen Ger\u00e4tetr\u00e4ger'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'truppweise zusammen bleiben.',
				correct: true
			},
			{
				letter: 'b',
				text: 'sich gegebenenfalls dicht am Boden halten, da hier die Temperatur geringer und die Sicht besser ist.',
				correct: true
			},
			{
				letter: 'c',
				text: 'eine st\u00e4ndige Sprechfunkverbindung zur Atemschutz\u00fcberwachung aufrecht erhalten.',
				correct: true
			},
			{
				letter: 'd',
				text: 'durch eine Feuerwehrleine, ein Leinensystem oder eine Schlauchleitung den R\u00fcckweg sichern.',
				correct: true
			}
		],
		number: 67,
		text: 'Gehen Atemschutzger\u00e4tetr\u00e4ger zur Brandbek\u00e4mpfung in den Innenangriff vor, m\u00fcssen sie'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'bei erkannter akuter Einsturzgefahr',
				correct: true
			},
			{
				letter: 'b',
				text: 'bei einer erkannten bevorstehenden Durchz\u00fcndung',
				correct: true
			},
			{
				letter: 'c',
				text: 'bei einer zu starken W\u00e4rmeentwicklung (z.B. sichtbares Abschmelzen von Kunststoffteilen)',
				correct: true
			},
			{
				letter: 'd',
				text: 'bei einer akuten Gef\u00e4hrdung, die durch den Gruppenf\u00fchrer nicht vorherzusehen war',
				correct: true
			}
		],
		number: 68,
		text: 'Wann muss sich ein Atemschutztrupp im Innenangriff selbstst\u00e4ndig in einen sicheren Bereich zur\u00fcckziehen?'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'nach Kontamination mit aggressiven Chemikalien, sowie starkem Ru\u00dfniederschlag',
				correct: true
			},
			{
				letter: 'b',
				text: 'nach einer direkten Beflammung (z.B. Durchz\u00fcndung)',
				correct: true
			},
			{
				letter: 'c',
				text: 'nach einem l\u00e4ngeren Aufenthalt in hoch erhitzten R\u00e4umen',
				correct: true
			},
			{
				letter: 'd',
				text: 'nach einem harten Aufschlag des Druckminderers w\u00e4hrend eines Durchganges in der Atemschutz\u00fcbungsstrecke',
				correct: true
			}
		],
		number: 69,
		text: 'Nach welchen Belastungen muss ein Atemschutzger\u00e4t von einem Atemschutzger\u00e4tewart gesondert \u00fcberpr\u00fcft werden?'
	},
	{
		answers: [
			{
				letter: 'a',
				text: 'Vollst\u00e4ndig bis zum Anschlag und dann eine halbe Umdrehung wieder zur\u00fcck, um die Spannungen aus den Gewindeg\u00e4ngen des Ventils herauszunehmen.',
				correct: false
			},
			{
				letter: 'b',
				text: 'Eine halbe Umdrehung reicht aus, um den Pressluftatmer schneller einsatzbereit zu bekommen.',
				correct: false
			},
			{
				letter: 'c',
				text: 'Vollst\u00e4ndig bis zum Anschlag, um ein selbstst\u00e4ndiges Schlie\u00dfen des Flaschenventils zu verhindern.',
				correct: true
			},
			{
				letter: 'd',
				text: 'Es gibt keine speziellen Vorgaben.',
				correct: false
			}
		],
		number: 70,
		text: 'Wie weit muss das Flaschenventil der Atemluftflasche aufgedreht werden?'
	}
];

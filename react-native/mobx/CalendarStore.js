import { observable, action, computed } from 'mobx'



class CalendarStore {
    @observable filterWeek = {};

    @observable weeksData = [
        {
            key: 1,
            title: '',
            body: `The first day of your period. The first day of the last period you will have for a long time. Because it is not easy to pinpoint the exact date when the sperm and egg meet, it is caculated using the first day of the last period you have.`,
        },
        {
            key: 2,
            title: '',
            body: `The second week is around ovulation, this and the first week are approximately the time period when the egg and the sperm meet and start to form an embreyo.`,
        },
        {
            key: 3,
            title: '',
            body: `The third week is when your womb starts to develip a warm and cozy environment, your baby's embreyo starts to take place in your womb. You won't start to feel symptoms at this point, your egg is fertilized, it burrows into the lining of your uterus. This is called implantation.`,
        },
        {
            key: 4,
            title: '',
            body: `This is the last week of fertilization or like explained, implantation of the embreyo in your womb. You might to start experiencing bloating, mild cramping (this is the embreyo placing itself in your womb), Mood swings, morning sickness, fatigue, sore breasts.`,
        },
        {
            key: 5,
            title: '',
            body: `The placenta is under construction and your hCG hormone levels are now high enough to confirm you are pregnant on a home pregnancy test. You may be able to see the heart beat of your baby, but if not don't worry usually around week 7-8 you will be able to see in the ultrasound the baby's heartbeat.`,
        },
        {
            key: 6,
            title: '',
            body: `At this stage you might start to have frequent visits to the restroom. Your kidneys are started to expand and with comes more need to urinate.You've probably started putting on weight which is normal. And also start experience spotting, if it is something that may seem like too much you may contact your doctor for furthur checkup.`,
        },
        {
            key: 7,
            title: '',
            body: `This week many parts of your baby continue to develop. The heart, lungs, intestins, appendix, brain, spinal cord, nostrals, mouth and eyes. At this stage the brain is growing faster than the body therefore the embryo forehead is large. Your doctor might recommend taking folic acid for the embryo. You might start feeling cravings for certain foods as well, yummy for mommy. `,
        },
        {
            key: 8,
            title: '',
            body: `At the sixth week of development webbed fingers and toes, eyelid folds and ears are forming allowing your baby to swim through your uterus. Your blood volume is increasing and your heart is growing, probably pumping 50% more blood. Therefore you might start feeling shortness of breath, excercise may be useful and is allowed. Three times a week a thirty minute walk is healthy for you and your baby.`,
        },
        {
            key: 9,
            title: '',
            body: `Your baby is about the size of an olive, during ultrasound you might be able to see your baby moving. It is important to make sure that you do blood work and some woman sort out doctors appointments a head of time for each ultrasound. A tip for this week, make sure you have calcium in your food schedule.`,
        },
        {
            key: 10,
            title: '',
            body: `During this week tooth budes are developing under the gums even if your baby's teeth will only start ocming out around six months old. The bones are cartilage are forming this week, knees and ankles.`,
        },
        {
            key: 11,
            title: '',
            body: `Fingernail and toenail beds are starting to develop, fingers and toes are separating and your baby's genitals are developing, but the sex can't be determined yet by ultrasound.`,
        },
        {
            key: 12,
            title: '',
            body: `At this stage you might get headaches or dizziness, make sure to drink a lot of water for you and your baby. By the end of this week, the chance of miscarriage drop and you'll start to feel more energetic. You might of also gained about 1.5 to 5 pounds about now`,
        },
        {
            key: 13,
            title: '',
            body: `Your baby's eyelids are shut to protect their small peepers as they continue to develop their eyes. The head is about half the size of the full body. You might start having an increase in your sex drive and also visible veins.`,
        },
        {
            key: 14,
            title: '',
            body: `There is hair sprouting on your baby's head, eyebrows and body. Your baby is developing organs such as the liver, which is performing the digestive function, the kidneys are producing urine, their spleen is producing red blood cells (erythrocytes), their bone marrow starts forming blood as well.`,
        },
        {
            key: 15,
            title: '',
            body: `During this week you might start to have heart burn, your uterus is growing big and the organs inside your abdomen can lead to acid reflux. Stuffy nose, or bloody nose from the blood flow to your mucous membranes. And swollen gums due to pregnancy hormones. Since during the second trimester you will be gaining more weight, doctors recommend eating approximately 300 extra calories each day and best to keep them healthy calories.`,
        },
        {
            key: 16,
            title: '',
            body: `This week you might have a ultrasound to determine the babies sex, boy or girl that beautiful beauty growing inside is continuing to develop. If it is a girl she should have all her eggs already in her uterus. And your baby is about the size of an avocado. During this week you might experience bachaches, exercise may help, as for bigger boobs, constipation, forgetfullness, dry and itchy eyes and glowing skin.`,
        },
        {
            key: 17,
            title: '',
            body: `Fat stores under your baby's skin are developing in order to keep your little one warm after birth. Your little one is practicing sucking and swallowing, the liquids being swallowed are the first to come out once your baby is born.`,
        },
        {
            key: 18,
            title: '',
            body: `Myelin, a protective insulation, is developing around the nerves of your baby and will continue until your baby is about one years old. The tiny fingers and toes are stating to develop unique prints that only your baby will have. As big as an artichoke you might start having trouble sleeping and you might even start feeling a couple of flutters from your baby's kicks.`,
        },
        {
            key: 19,
            title: '',
            body: `If you start to experience hip pains it is probably because your baby is growing big now, you probably put on about 8 to 14 pounds as well, or 20 to 30 pounds if your having twins. If you experience a sudden rapid gain in weight, it could be preeclampsia so it is best you check this with your doctor. Your baby's skin is covered in vernix caseaosa, white cheese-like coating that protects your baby's skin. You babies lungs are developing and you haven't felt any kicks until now, until week 21 you should start to feel them getting stronger`,
        },
        {
            key: 20,
            title: '',
            body: `Your baby is the size of a orange, and this week you might start to experience Swelling. Don't worry unless the swelling is sudden or severe, this will start subsiding after delivery. In the meantime, you can put up your legs to relief the feeling.`,
        },
        {
            key: 21,
            title: '',
            body: `Your baby's spleen and liver have been working hard, producing blood cells, cartilage tissue is now hardening, the bone marrow from long bones are coming in to give a helping hand.`,
        },
        {
            key: 22,
            title: '',
            body: `Baby's ears are beginning to hear different soudns that are going on inside your body like breathing and your heartbeat. Your baby is sharpening their senses and learning to grab their nose, ears, umbilical cord. If you start to have stretch marks, moisturizure or differnent oils may help. Such as cocunt oil or almond oil.`,
        },
        {
            key: 23,
            title: '',
            body: `Your pacenta is your baby's complete support system, transfering nutrients and oxygen that your baby needs. If you start having Braxton Hicks contractions, dont get worried, you can start feeling and getting to know the feeling of contractions. Drink plenty of water, make sure to stay hydrated.`,
        },
        {
            key: 24,
            title: '',
            body: `The size of an eggplant your baby has an advancing auditory system as for pigments needed for eyelashes, eyebrows and hair. You might have an ultrasound to check the baby's heart beat and development. The heartbeat should be about 120-160 beats per minute.`,
        },
        {
            key: 25,
            title: '',
            body: `The size of a cauliflower you have probably gaines about 15 to 18 pounds and 25 to 40 pounds if you are having twins. At this point you may look into your birth plan, maybe taking birth classes to get ready for what comes next, birth.`,
        },
        {
            key: 26,
            title: '',
            body: `Your baby is starting to run out of room to do the acrobatics and starting to find a position for birth. The circulatory system and blood vessels are fully functioning as for the heart which is pumping blood.`,
        },
        {
            key: 27,
            title: '',
            body: `You baby may start having the hiccups, you'll feel an unusual sensation in your belly. The lungs continue to develop therefore the hiccups. Teeny tiny fingernails have arrived and muscle toning from all the kicking has started developing.`,
        },
        {
            key: 28,
            title: '',
            body: `At this stage it is possible that your baby is dreaming, they are developing REM (rapid eye movement) even if your baby's eyes have been shut, your baby can open and close their eyes. They start to stick out their tongue and taste the amniotic fluid. You might start to experience leaky boobs, a yellowish substance called colostrum, your baby's first food.`,
        },
        {
            key: 29,
            title: '',
            body: `If your belly starts to itch, drink water and put more mosurizure, let your doctor know if any itches or rashes start. You may also experience hemorrhoids fromt he pressure on your digestive system and frequent urination.`,
        },
        {
            key: 30,
            title: '',
            body: `As for your baby who has fully formed hands, the surface of your baby’s brain is wrinkling (convolutions)  in order to hold brain cells. You are now in your third trimester therefore the sideeffects or different, you may have a decrease in your sex drive because of a change in your hormones, this is normal.`,
        },
        {
            key: 31,
            title: '',
            body: `This week your baby is about the size of a zucchini, weighing in at almost a kilo and a half. Your baby's brain is developing and may already process information and pick up signals. During these last weeks, you might feel tightening of your uterus, a bit of pressure, which might get stronger as you get closer to birth.`,
        },
        {
            key: 32,
            title: '',
            body: `At this point your baby's organs are fully formed and the chances for survival if born now are very high. You baby is inhaling amniotic fluid giving their lungs practive. You are now in your 8th month and you might be experience vaginal discharge. If you experience vaginal bleeing, such as spotting, is normal but it could be from the cervix and it is best to notify your doctor`,
        },
        {
            key: 33,
            title: '',
            body: `The plates in your baby's skull are pliable in order to be able to squeeze down the birth canal. You baby drinks about a pink of amniotic fluid a day helping prepare the gastrointestinal system and is also puting on weight before coming out and joining your outside of your womb. Because your metaboloix rate is high you might start to feel overheating, shortness of breath, headaches, forgetfulness and clumsiness.`,
        },
        {
            key: 34,
            title: '',
            body: `The vernix, chessy coating on your baby's skin is thickening, getting ready to shed soo. You might start to see hands and deet through your belly. Your urinary incontinence because of pressure may cause a leak in some urine, especially when you sneeze, cough or laugh, this is normal and should go away after birth`,
        },
        {
            key: 35,
            title: '',
            body: `What you eat during the last stages of pregnancy is very important to make sure you baby is strong for delievy. Drink a lot of water, small meals this might help with heartburn or constipation. Try using a pillow to make it easier on you to sleep, your baby is about the size of a melon at this point.`,
        },
        {
            key: 36,
            title: '',
            body: `The baby's head is down and you have less space in your uterus for the baby's movements. This week is the beginning of the final month of pregnancy. Your baby is the size of a papaya. Your baby's fetal development is basically finished. It fully is mature and complete at about 1 to 2 years old. Small meals are recommended for mommy's and the right pregnancy bra.`,
        },
        {
            key: 37,
            title: '',
            body: `The most of your baby's growth throughout the last month is fat. You may feel that the baby may have dropped lower into your pelvis this week in which is called “lightening” or “dropping". Your baby is ready to grasp your hand.`,
        },
        {
            key: 38,
            title: '',
            body: `During this week your baby is almost at full term, you might experience mucus plug and/or a bloody show, diarrhea, nasua, contractions, back pain and maybe even your water break. If you start to feel contractions or your water breaks it is time to consult your doctor, time your contractions to see if you are in labor.`,
        },
        {
            key: 39,
            title: '',
            body: `Now the size of a watermelon your baby is ready to cry. Your baby's pink skin turns to white and your baby's skin is turning white from pink. At the right weight for birth between 6 to 9 pounds.`,
        },
        {
            key: 40,
            title: '',
            body: `This week means you reach full term and your doctor might recommend you come in for check ups everyday once you've reached 40 weeks. Good luck to all the new parents`,
        },
        {
            key: 41,
            title: '',
            body: `Not many reach this week but if your baby wants to stay in some more it is alright until week 42, you will probably be coming in for regular checks and you will experience pressure on your pelvic area.`
        },
        {
            key: 42,
            title: '',
            body: `Time to go to the doctor, your doctor might recommend speeding up birth so that the baby doesnt get to big in your body. Congragulations parents.`
        }
    ]

    @action filter(currentWeek) {
        const weekData = this.weeksData.filter(week => week.key === currentWeek);
        return weekData;
    }

}

const calendarStore = new CalendarStore();
export default calendarStore
import time
import RPi.GPIO as GPIO

pin=[3,5,8,11,13]

GPIO.setmode(GPIO.BOARD)

def setup(p):
        GPIO.setup(pin[p], GPIO.OUT)

def out(p, v):
        GPIO.output(pin[i], v)

for i in range(0, len(pin)): setup(i)

GPIO.setup(26, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

for i in range(0, len(pin)): out(i, 0);

GPIO.add_event_detect(26, GPIO.RISING,  bouncetime=10)

try:
        while True:
                for i in range(0, len(pin)):
                        v = GPIO.input(26)
                        time.sleep(0.2)
                        out(i, 1);

                        if (i == len(pin)-1):
                                t1 = time.time()
                                if GPIO.input(26) == 1:
                                        t2 = time.time()
                                        print t2 - t1
                                else:
                                        print "false"

                time.sleep(0.2)
                for i in range(len(pin)-1, -1, -1):
                        out(i, 0);

except KeyboardInterrupt:
        GPIO.cleanup()



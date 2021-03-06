class fighter():
  def __init__(self, hp, b_atk, rx):
    self.hp = hp
    self.b_atk = b_atk
    self.atk = b_atk
    self.rx = rx

F4RX, F3RX, F2RX, F1RX = 30, 20, 10, 5

# f4 | f1_ _ _ _ _| f2_ _ _ | f3 _ _ | >=1
F4HP = F1RX*4 + F2RX*2 + F3RX*1 + 5

F4ATK = 12
print("F4HP", F4HP)
F1HP = F4ATK*10+5 # (1+2+3+4, +5] (10,15]
print("F1HP", F1HP)
F2HP = F4ATK*18-1 # (6+7, +8]  (13,21]
print("F2HP", F2HP)
F3HP = F4ATK*15 # (9, +10] (9,19]
print("F3HP", F3HP)

F1ATK = 11
F2ATK = 4
F3ATK = 2


f1 = fighter(F1HP, F1ATK, F1RX)
f2 = fighter(F2HP, F2ATK, F2RX)
f3 = fighter(F3HP, F3ATK, F3RX)
f4 = fighter(F4HP, F4ATK, F4RX)

def reset(f1,f2,f3,f4):
  f1.hp, f1.atk = F1HP, F1ATK
  f2.hp, f2.atk = F2HP, F2ATK
  f3.hp, f3.atk = F3HP, F3ATK
  f4.hp, f4.atk = F4HP, F4ATK


def fight(f1, f2):
  if (f1.hp <= 0): return
  if (f2.hp <= 0): return

  while(True):
    f2.hp -= f1.atk
    f1.atk += f1.b_atk

    if (f2.hp <= 0): return

    f1.hp -= f2.rx

    if (f1.hp <= 0): return


def fightSeq(fm, fseq, result):
  for df in fseq:
    fight(fm, df)
  
  if (fm.hp > 0 and result):
    return True
  if (fm.hp <= 0 and not result):
    return True

  print(fm.hp, fm.atk)
  print([df.hp for df in fseq])
  return False


print("FIGHTER 4")
#1
reset(f1,f2,f3,f4)
print("!!!123" if not fightSeq(f4,[f1,f2,f3],1) else "")
#2
reset(f1,f2,f3,f4)
print("132" if not fightSeq(f4,[f1,f3,f2],0) else "")
#3
reset(f1,f2,f3,f4)
print("213" if not fightSeq(f4,[f2,f1,f3],0) else "")
#4
reset(f1,f2,f3,f4)
print("231" if not fightSeq(f4,[f2,f3,f1],0) else "")
#5
reset(f1,f2,f3,f4)
print("312" if not fightSeq(f4,[f3,f1,f2],0) else "")
#6
reset(f1,f2,f3,f4)
print("321" if not fightSeq(f4,[f3,f2,f1],0) else "")

print("FIGHTER 1")
#1
reset(f1,f2,f3,f4)
print("234" if not fightSeq(f1,[f2,f3,f4],1) else "")
#2
reset(f1,f2,f3,f4)
print("243" if not fightSeq(f1,[f2,f4,f3],1) else "")
#3
reset(f1,f2,f3,f4)
print("324" if not fightSeq(f1,[f3,f2,f4],1) else "")
#4
reset(f1,f2,f3,f4)
print("342" if not fightSeq(f1,[f3,f4,f2],1) else "")
#5
reset(f1,f2,f3,f4)
print("423" if not fightSeq(f1,[f4,f2,f3],1) else "")
#6
reset(f1,f2,f3,f4)
print("!!!432" if not fightSeq(f1,[f4,f3,f2],0) else "")

print("FIGHTER 2")
#1
reset(f1,f2,f3,f4)
print("134" if not fightSeq(f2,[f1,f3,f4],1) else "")
#2
reset(f1,f2,f3,f4)
print("143" if not fightSeq(f2,[f1,f4,f3],1) else "")
#3
reset(f1,f2,f3,f4)
print("314" if not fightSeq(f2,[f3,f1,f4],1) else "")
#4
reset(f1,f2,f3,f4)
print("341" if not fightSeq(f2,[f3,f4,f1],1) else "")
#5
reset(f1,f2,f3,f4)
print("413" if not fightSeq(f2,[f4,f1,f3],0) else "")
#6
reset(f1,f2,f3,f4)
print("431" if not fightSeq(f2,[f4,f3,f1],0) else "")
print("FIGHTER 3")
#1
reset(f1,f2,f3,f4)
print("124" if not fightSeq(f3,[f1,f2,f4],1) else "")
#2
reset(f1,f2,f3,f4)
print("142" if not fightSeq(f3,[f1,f4,f2],1) else "")
#3
reset(f1,f2,f3,f4)
print("214" if not fightSeq(f3,[f2,f1,f4],0) else "")
#4
reset(f1,f2,f3,f4)
print("241" if not fightSeq(f3,[f2,f4,f1],0) else "")
#5
reset(f1,f2,f3,f4)
print("412" if not fightSeq(f3,[f4,f1,f2],0) else "")
#6
reset(f1,f2,f3,f4)
print("421" if not fightSeq(f3,[f4,f2,f1],0) else "")
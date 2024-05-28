/******************************************************************************
  Target Script for TI ICEPick

  Copyright (c) 2011, 2012 Rowley Associates Limited.

  This file may be distributed under the terms of the License Agreement
  provided with this software.

  THIS FILE IS PROVIDED AS IS WITH NO WARRANTY OF ANY KIND, INCLUDING THE
  WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 ******************************************************************************/

//
// ICEPick instructions 6 bit IR
//
var ROUTER = 0x2;
var IDCODE = 0x4;
var ICEPICKCODE = 0x5;
var CONNECT = 0x7;
var USERCODE = 0x8;

function ICEPickGetIDCODE()
{  
  ICEPickInstruction(IDCODE);
  TargetInterface.scanDR(32, 1);
  return TargetInterface.unpackScanChain(0, 31); 
}

function ICEPickGetICEPICKCODE()
{ 
  ICEPickInstruction(ICEPICKCODE);
  TargetInterface.scanDR(32, 1);
  return TargetInterface.unpackScanChain(0, 31);
}

function ICEPickGetUSERCODE()
{ 
  ICEPickInstruction(USERCODE);
  TargetInterface.scanDR(32, 1);
  return TargetInterface.unpackScanChain(0, 31);
}

function ICEPickInstruction(i)
{
  TargetInterface.packScanChain(i, 0, 5);
  TargetInterface.scanIR(6, 1);
}

function ICEPickStart()
{ 
  ICEPickInstruction(CONNECT);
  TargetInterface.packScanChain(0x89, 0, 7); // Write and connect
  TargetInterface.scanDR(8, 1);  
}

function ICEPickGetCONTROL()
{  
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x00000000 | (0 << 28) | (1 << 24), 0, 32-1);
  TargetInterface.scanDR(32, 2);  
  return TargetInterface.unpackScanChain(32, 63) & 0xffffff;
}

function ICEPickSetCONTROL(v)
{ 
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x80000000 | (0 << 28) | (1 << 24) | v, 0, 32-1);
  TargetInterface.scanDR(32, 1);
}

function ICEPickGetSTTR(n)
{  
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x00000000 | (1 << 28) | (n << 24), 0, 32-1); 
  TargetInterface.scanDR(32, 2);
  return TargetInterface.unpackScanChain(32, 63) & 0xffffff;
}

function ICEPickSetSTTR(n,v)
{  
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x80000000 | (1 << 28) | (n << 24) | v, 0, 32-1);
  TargetInterface.scanDR(32, 1);
}

function ICEPickGetSDTR(n)
{  
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x00000000 | (2 << 28) | (n << 24), 0, 32-1); 
  TargetInterface.scanDR(32, 2);
  return TargetInterface.unpackScanChain(32, 63) & 0xffffff;
}

function ICEPickSetSDTR(n,v)
{  
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x80000000 | (2 << 28) | (n << 24) | v, 0, 32-1);
  TargetInterface.scanDR(32, 1);
}

function ICEPickAddTAP(n)
{
  ICEPickSetSDTR(n, (1 << 13) | (1 << 8) | (1 << 3)); // DEBUGENABLE|SELECTTAP|FORCEACTIVE 
}

function ICEPickAddTAPAndCore(n, m)
{
  ICEPickInstruction(ROUTER);
  TargetInterface.packScanChain(0x80000000 | (2 << 28) | (n << 24) | (1 << 13) | (1 << 3), 0, 32-1); // DEBUGENABLE|FORCEACTIVE 
  TargetInterface.scanDR(32, 1); 
  TargetInterface.packScanChain(0x80000000 | (6 << 28) | (m << 24) | (1 << 13) | (1 << 3), 0, 32-1); // DEBUGENABLE|FORCEACTIVE 
  TargetInterface.scanDR(32, 1);
  TargetInterface.packScanChain(0x80000000 | (2 << 28) | (n << 24) | (1 << 13) | (1 << 8) | (1 << 3), 0, 32-1); // DEBUGENABLE|SELECTTAP|FORCEACTIVE 
  TargetInterface.scanDR(32, 1); 
}

function ICEPickSYSTEMRESET()
{   
  ICEPickSetCONTROL(1<<0); // SYSTEMRESET
}

function ICEPickFinish()
{
  ICEPickInstruction(IDCODE);

  // 10 TCKs in Run-Test-Idle
  TargetInterface.setTMS(0);
  TargetInterface.cycleTCK(10);  
}

function ICEPickShowIDCODE(idcode)
{ 
  TargetInterface.message("TAPID: 0x"+idcode.toString(16));
}

function ICEPickShowICEPICKCODE(idcode)
{    
  m = "ICEPickID: 0x"+idcode.toString(16); 
  MAJOR = (idcode >> 28) & 0xf;
  m += " MAJOR: "+MAJOR.toString();
  MINOR = (idcode >> 24) & 0xf;
  m += " MINOR: "+MINOR.toString();
  TEST_TAP = (idcode >> 20) & 0xf;
  if (TEST_TAP == 0)
    TEST_TAP = 16;
  m += " TEST_TAP: "+TEST_TAP.toString();
  EMU_TAP = (idcode >> 16) & 0xf;
  if (EMU_TAP == 0)
    EMU_TAP = 16;
  m += " EMU_TAP: "+EMU_TAP.toString();
  ICEPICK = (idcode >> 4) & 0xfff;
  m += " ICEPICK: 0x"+ICEPICK.toString(16);
  CAPA1 = (idcode >> 1) & 1;
  m += " CAPA1: "+CAPA1.toString();
  CAPA0 = idcode & 1;
  m += " CAPA0: "+CAPA0.toString();
  TargetInterface.message(m);
}

function ICEPickShowUSERCODE(usercode)
{   
  TargetInterface.message("UC: 0x"+usercode.toString(16));
}

function ICEPickShowCONTROL(control)
{    
  m = "CONTROL: 0x"+control.toString(16); 
  if (control & (1<<17))
    m += " ADVANCERTCKTIMING";  
  if (control & (1<<15))
    m += " UNNATURALSYSRESET";  
  if (control & (1<<14))
    m += " REDUCEDTCK";  
  if (control & (1<<13))
    m += " SYSTEMSTATUS";  
  if (control & (1<<12))
    m += " FREERUNNINGEMUL";  
  if (control & (1<<10))
    m += " CLEARALLEXEFLAG"; 
  if (control & (1<<9))
    m += " GLOBALEXEMASK";  
  if (control & (1<<8))
    m += " GLOBALRELEASEWIR";  
  if (control & (1<<7))
    m += " KEEPPOWERINTLR";  
  if (control & (1<<6))
    m += " BLOCKSYSRESET";  
  if (control & (1<<5))
    m += " TDOALWAYSOUT";
  DEVICETYPE = (control >> 1) & 7;
  m += " DEVICETYPE: 0x" + DEVICETYPE.toString(16);  
  if (control & 1)
    m += " SYSTEMRESET";
  TargetInterface.message(m);
}

function ICEPickShowSDTR(n, SDTR)
{    
  m = "SDTR"+n+": 0x"+SDTR.toString(16);  
  if (SDTR & (1<<23))
    m += " BLOCKNTRST";
  if (SDTR & (1<<21))
    m += " POWERLOSSDETECTED";
  if (SDTR & (1<<20))
    m += " INHIBITSLEEP";
  if (SDTR & (1<<19))
    m += " TAPPOWER";
  if (SDTR & (1<<18))
    m += " UNNATURALRESET";
  if (SDTR & (1<<17))
    m += " INRESETANDRELEASEWIR";
  RESETCONTROL = (SDTR >> 14) & 0x7;
  m += " RESETCONTROL: 0x" + RESETCONTROL.toString(16);
  if (SDTR & (1<<13))
    m += " DEBUGENABLE";
  DEBUGMODE = (SDTR >> 11) & 0x3;
  m += " DEBUGMODE: 0x" + DEBUGMODE.toString(16);
  if (SDTR & (1<<10))
    m += " DEBUGANDEXECUTE";
  if (SDTR & (1<<9))
    m += " VISIBLETAP";
  if (SDTR & (1<<8))
    m += " SELECTTAP";
  if (SDTR & (1<<7))
    m += " POWERDOWNDESIRED";
  if (SDTR & (1<<6))
    m += " FORCEPOWER";
  if (SDTR & (1<<5))
    m += " POWER";
  if (SDTR & (1<<4))
    m += " CLOCKDOWNDESIRED";
  if (SDTR & (1<<3))
    m += " FORCECLOCK";
  if (SDTR & (1<<2))
    m += " CLOCK";
  if (SDTR & (1<<1))
    m += " TAPACCESSIBLE";
  if (SDTR & 1)
    m += " TAPPRESENT";
  TargetInterface.message(m);
}

function ICEPickShowSDTRs()
{
  for (i=0;i<16;i++)
    {
      SDTR = ICEPickGetSDTR(i);
      if (SDTR & 1)
        {         
          ICEPickShowSDTR(i, SDTR);
        }
    }
}

function ICEPickShowSTTR(n, STTR)
{    
  m = "STTR"+n+": 0x"+STTR.toString(16); 
  if (STTR & (1<<9))
    m += " VISIBLETAP";
  if (STTR & (1<<8))
    m += " SELECTTAP";
  if (STTR & (1<<1))
    m += " TAPACCESSIBLE";
  if (STTR & 1)
    m += " TAPPRESENT";
  TargetInterface.message(m); 
}

function ICEPickShowSTTRs()
{
  for (i=0;i<16;i++)
    {
      STTR = ICEPickGetSTTR(i);
      if (STTR & 1)
        {         
          ICEPickShowSTTR(i, STTR);
        }
    }
}
